# compile_circuit.ps1

Write-Host "Checking for circom..."
if (!(Get-Command "circom" -ErrorAction SilentlyContinue)) {
    Write-Error "Circom is not installed or not in PATH. Please install it: https://docs.circom.io/getting-started/installation/"
    exit 1
}

# Create build directories
New-Item -ItemType Directory -Force -Path "build/circuits" | Out-Null
New-Item -ItemType Directory -Force -Path "dashboard/public" | Out-Null

Write-Host "Compiling Circuit..."
circom circuits/credential.circom --r1cs --wasm --sym --output build/circuits

if (!(Test-Path "build/circuits/credential.r1cs")) {
    Write-Error "Compilation failed."
    exit 1
}

Write-Host "Downloading Power of Tau (Phase 1)..."
if (!(Test-Path "build/circuits/pot12_final.ptau")) {
    Invoke-WebRequest -Uri "https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_12.ptau" -OutFile "build/circuits/pot12_final.ptau"
}

Write-Host "Generating zkey (Phase 2)..."
npx snarkjs groth16 setup build\circuits\credential.r1cs build\circuits\pot12_final.ptau build\circuits\credential_0000.zkey

Write-Host "Contributing to Phase 2..."
# We use a non-interactive contribution for the demo script
npx snarkjs zkey contribute build\circuits\credential_0000.zkey build\circuits\credential_final.zkey --name="Demo Contribution" -v -e="random entropy"

Write-Host "Exporting Verification Key..."
npx snarkjs zkey export verificationkey build\circuits\credential_final.zkey build\circuits\verification_key.json

Write-Host "Copying artifacts to dashboard/public..."
Copy-Item "build/circuits/verification_key.json" -Destination "dashboard/public/verification_key.json" -Force
Copy-Item "build/circuits/credential_js/credential.wasm" -Destination "dashboard/public/credential.wasm" -Force
Copy-Item "build/circuits/credential_final.zkey" -Destination "dashboard/public/credential_final.zkey" -Force

Write-Host "ZKP Setup Complete!"
