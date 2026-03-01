Write-Host "FrontierDispatch setup"
Set-Location "$PSScriptRoot/../apps/web"
npm install
Copy-Item ".env.example" ".env.local" -ErrorAction SilentlyContinue
Write-Host "Done. Edit apps/web/.env.local and run: npm run dev"
