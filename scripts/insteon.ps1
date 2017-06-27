
Function GetHeaders(
    [string][Parameter(Mandatory=$True)]$ApiKey,
    [string][Parameter(Mandatory=$True)]$BearerKey
){
     return  @{
        "Authentication" = "APIKey $ApiKey";
        "Authorization" = "Bearer $BearerKey";
    };
}

Function GetHouses(
    [string][Parameter(Mandatory=$True)]$ApiKey,
    [string][Parameter(Mandatory=$True)]$BearerKey

){
    $hubApiUrl = "https://connect.insteon.com/api/v2/houses"
    $headers = @{
        "Authentication" = "APIKey $ApiKey";
        "Authorization" = "Bearer $BearerKey";
    };

    return  Invoke-RestMethod -Uri $hubApiUrl -Headers $headers
}


Function GetHubInfo(
    [string][Parameter(Mandatory=$True)]$ApiKey,
    [string][Parameter(Mandatory=$True)]$BearerKey

){
    $houses = GetHouses -ApiKey $ApiKey -BearerKey $BearerKey
    $houseId = $houses.HouseList[0].HouseID
    $hubApiUrl = "https://connect.insteon.com/api/v2/houses/$houseId"
    $headers = @{
        "Authentication" = "APIKey $ApiKey";
        "Authorization" = "Bearer $BearerKey";
    };

    return  Invoke-RestMethod -Uri $hubApiUrl -Headers $headers
}


Function GetDevices(
    [string][Parameter(Mandatory=$True)]$ApiKey,
    [string][Parameter(Mandatory=$True)]$BearerKey

){
    $headers = GetHeaders -ApiKey $ApiKey -BearerKey $BearerKey
    $devicesApiUrl = "https://connect.insteon.com/api/v2/devices"
    return (Invoke-RestMethod -Uri $devicesApiUrl -Headers $headers).DeviceList
}

Function GetDeviceInfo(
    [string][Parameter(Mandatory=$True)]$ApiKey,
    [string][Parameter(Mandatory=$True)]$BearerKey,
    [string][Parameter(Mandatory=$True)]$DeviceId

){
    $headers = GetHeaders -ApiKey $ApiKey -BearerKey $BearerKey
    $devicesApiUrl = "https://connect.insteon.com/api/v2/devices/$DeviceId"
    return Invoke-RestMethod -Uri $devicesApiUrl -Headers $headers
}

Function GetDeviceStatus(
    [string][Parameter(Mandatory=$True)]$ApiKey,
    [string][Parameter(Mandatory=$True)]$BearerKey,
    [int][Parameter(Mandatory=$True)]$DeviceId
){
    $headers = GetHeaders -ApiKey $ApiKey -BearerKey $BearerKey

    $commandApiUrl = "https://connect.insteon.com/api/v2/commands"
    $command = @{
        "command"= "get_sensor_status";
        "device_id"= $DeviceId
    }
    #$Write-Host (ConvertTo-Json $command)
    return Invoke-RestMethod -Uri $commandApiUrl -ContentType 'application/json' -Headers $headers -Method Post -Body (ConvertTo-Json $command)
}

Function GetCommandStatus(
    [string][Parameter(Mandatory=$True)]$ApiKey,
    [string][Parameter(Mandatory=$True)]$BearerKey,
    [int][Parameter(Mandatory=$True)]$CommandId
){
    $headers = GetHeaders -ApiKey $ApiKey -BearerKey $BearerKey

    $commandApiUrl = "https://connect.insteon.com/api/v2/commands/$CommandId"
    
    return Invoke-RestMethod -Uri $commandApiUrl -Headers $headers
}


$config = Get-Content ..\config.json |ConvertFrom-Json
$ApiKey = $config.API_KEY

$AuthenticationApiUrl = "https://connect.insteon.com/api/v2/oauth2/token"
$AuthenticationRequest = "grant_type=password&username=$($Config.INSTEON_USER_NAME)&password=$($Config.INSTEON_PASSWORD)&client_id=$ApiKey"
$AuthResponse=Invoke-RestMethod -Uri $AuthenticationApiUrl -Method Post -Body $AuthenticationRequest

# $Houses = GetHouses -ApiKey $ApiKey -BearerKey $AuthResponse.access_token
# $Houses

#$hubInfo = GetHubInfo -ApiKey $ApiKey -BearerKey $AuthResponse.access_token
#$hubInfo

$devices = GetDevices -ApiKey $ApiKey -BearerKey $AuthResponse.access_token
$devices

#$smallGarageInfo = GetDeviceInfo -DeviceId 1326980 -ApiKey $ApiKey -BearerKey $AuthResponse.access_token
#$smallGarageInfo

#$smallGarageStatus = GetDeviceStatus -DeviceId 1326980 -ApiKey $ApiKey -BearerKey $AuthResponse.access_token 
#$smallGarageStatus

# $i = 0;
# While ($i -lt 5){
#     $commandStatus = GetCommandStatus -ApiKey $ApiKey -BearerKey $AuthResponse.access_token -CommandId $smallGarageStatus.id
#     if ($commandStatus.status -eq 'pending'){
#         Write-Host "Status is pending"
#         Start-Sleep -Seconds 15
#         $i++
#     } else {
#         $commandStatus
#         break;
#     }
# }