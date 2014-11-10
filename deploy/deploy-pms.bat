@ECHO OFF

REM -- Uncomment to Init NPM first run --
REM CALL ..\..\set-npm.bat

ECHO Compiling JS...
CD ..\BackboneRibs
CALL grunt
CD ..\deploy
pause

ECHO Preparing NuGet...
CALL ..\..\set-nuget-key.bat
del *.nupkg
del content\Scripts\* /Q
mkdir content
mkdir content\Scripts
copy ..\BackboneRibs\backbone-ribs.js content\Scripts
copy ..\BackboneRibs\backbone-ribs.min.js content\Scripts
pause

ECHO Publishing to NPM...
CALL npm publish ..\BackboneRibs
pause

ECHO Publishing to NuGet...
nuget pack backbone-ribs.nuspec
nuget push *.nupkg
pause