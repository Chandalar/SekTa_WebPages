Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  SekTa Salibandy - Palautetaan grafiikat ennalleen" -ForegroundColor Yellow
Write-Host "===================================================" -ForegroundColor Cyan

Copy-Item -Path "src/backups_pre_graphics/*" -Destination "src/" -Recurse -Force
Copy-Item -Path "src/backups_pre_graphics/Tactics.jsx" -Destination "src/pages/Tactics.jsx" -Force
Copy-Item -Path "src/backups_pre_graphics/Team.jsx" -Destination "src/pages/Team.jsx" -Force
Copy-Item -Path "src/backups_pre_graphics/PlayerCard.jsx" -Destination "src/components/PlayerCard.jsx" -Force
Copy-Item -Path "src/backups_pre_graphics/Home.jsx" -Destination "src/pages/Home.jsx" -Force
Copy-Item -Path "src/backups_pre_graphics/Statistics.jsx" -Destination "src/pages/Statistics.jsx" -Force
Copy-Item -Path "src/backups_pre_graphics/HeroScene.jsx" -Destination "src/components/HeroScene.jsx" -Force
Copy-Item -Path "src/backups_pre_graphics/index.css" -Destination "src/styles/index.css" -Force

Write-Host "Valmis! Kaikki alkuperaiset tiedostot on palautettu." -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Cyan
