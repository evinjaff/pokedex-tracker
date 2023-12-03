convert input.gif -coalesce -repage 0x0 -crop 17x16+137+102 +repage cropped.gif
convert cropped.gif -fuzz 22% -transparent '#56e895' result.gif
