@echo off
echo ===================================================
echo   SekTa Salibandy - Palautetaan grafiikat ennalleen
echo ===================================================
echo Kopioidaan varmuuskopiot paikoilleen...

copy /Y "src\backups_pre_graphics\Tactics.jsx" "src\pages\Tactics.jsx"
copy /Y "src\backups_pre_graphics\Team.jsx" "src\pages\Team.jsx"
copy /Y "src\backups_pre_graphics\PlayerCard.jsx" "src\components\PlayerCard.jsx"
copy /Y "src\backups_pre_graphics\Home.jsx" "src\pages\Home.jsx"
copy /Y "src\backups_pre_graphics\Statistics.jsx" "src\pages\Statistics.jsx"
copy /Y "src\backups_pre_graphics\HeroScene.jsx" "src\components\HeroScene.jsx"
copy /Y "src\backups_pre_graphics\index.css" "src\styles\index.css"

echo.
echo Valmis! Kaikki alkuperaiset tiedostot on palautettu.
echo Voit myos halutessasi ajaa Git-komennon: git checkout main
echo ===================================================
pause
