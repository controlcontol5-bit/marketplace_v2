function Send-Response($client, $content, $contentType) {
    $response = "HTTP/1.1 200 OK`r`n" +
                "Content-Type: $contentType`r`n" +
                "Content-Length: $($content.Length)`r`n" +
                "Connection: close`r`n`r`n"
    $responseBytes = [System.Text.Encoding]::UTF8.GetBytes($response)
    $stream = $client.GetStream()
    $stream.Write($responseBytes, 0, $responseBytes.Length)
    $stream.Write($content, 0, $content.Length)
    $stream.Close()
    $client.Close()
}

$port = 8080
$server = [System.Net.Sockets.TcpListener]$port
$server.Start()
Write-Host "Server TCP berjalan di port $port..."

while($true) {
    if ($server.Pending()) {
        $client = $server.AcceptTcpClient()
        $stream = $client.GetStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $requestLine = $reader.ReadLine()
        
        if ($requestLine) {
            $path = $requestLine.Split(' ')[1]
            if ($path -eq "/") { $path = "/index.html" }
            $fullPath = Join-Path "C:\marketplace_v2" $path.TrimStart('/')
            
            if (Test-Path $fullPath -PathType Leaf) {
                $content = [System.IO.File]::ReadAllBytes($fullPath)
                $type = "text/plain"
                if ($fullPath.EndsWith(".html")) { $type = "text/html" }
                elseif ($fullPath.EndsWith(".css")) { $type = "text/css" }
                elseif ($fullPath.EndsWith(".js")) { $type = "application/javascript" }
                Send-Response $client $content $type
            } else {
                $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                Send-Response $client $msg "text/plain"
            }
        }
    }
    Start-Sleep -Milliseconds 10
}
