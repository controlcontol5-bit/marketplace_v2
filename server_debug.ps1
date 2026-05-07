function Send-Response($client, $content, $contentType) {
    try {
        $response = "HTTP/1.1 200 OK`r`n" +
                    "Content-Type: $contentType`r`n" +
                    "Content-Length: $($content.Length)`r`n" +
                    "Access-Control-Allow-Origin: *`r`n" +
                    "Connection: close`r`n`r`n"
        $responseBytes = [System.Text.Encoding]::UTF8.GetBytes($response)
        $stream = $client.GetStream()
        $stream.Write($responseBytes, 0, $responseBytes.Length)
        $stream.Write($content, 0, $content.Length)
        $stream.Flush()
    } catch {
        Write-Host "Error sending response: $($_.Exception.Message)"
    } finally {
        $client.Close()
    }
}

$port = 8080
$server = [System.Net.Sockets.TcpListener]$port
$server.Start()
Write-Host "Server Debug berjalan di port $port..."

while($true) {
    if ($server.Pending()) {
        $client = $server.AcceptTcpClient()
        $stream = $client.GetStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $requestLine = $reader.ReadLine()
        
        if ($requestLine) {
            Write-Host "Request: $requestLine"
            $parts = $requestLine.Split(' ')
            if ($parts.Length -ge 2) {
                $path = $parts[1]
                if ($path -eq "/") { $path = "/index.html" }
                
                # Remove query strings
                if ($path.Contains("?")) { $path = $path.Split('?')[0] }
                
                $fullPath = Join-Path "C:\marketplace_v2" $path.TrimStart('/')
                
                if (Test-Path $fullPath -PathType Leaf) {
                    $content = [System.IO.File]::ReadAllBytes($fullPath)
                    $type = "text/plain"
                    if ($fullPath.EndsWith(".html")) { $type = "text/html; charset=utf-8" }
                    elseif ($fullPath.EndsWith(".css")) { $type = "text/css" }
                    elseif ($fullPath.EndsWith(".js")) { $type = "application/javascript" }
                    elseif ($fullPath.EndsWith(".png")) { $type = "image/png" }
                    elseif ($fullPath.EndsWith(".jpg") -or $fullPath.EndsWith(".jpeg")) { $type = "image/jpeg" }
                    
                    Send-Response $client $content $type
                    Write-Host "Sent: $path ($type)"
                } else {
                    Write-Host "Not Found: $fullPath"
                    $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                    Send-Response $client $msg "text/plain"
                }
            }
        }
    }
    Start-Sleep -Milliseconds 10
}
