## console-log Web Component
| Color Type | Support     |
| :------------- | :------------- |
| ANSI       |   partial     |
| 256       |   ✅     |
| truecolor       |   ✅     |
[example](https://zvakanaka.github.io/console-log)  
## Usage
```js
const log = document.querySelector('console-log');
log.log('something new for the log', 'optional other comma separated things');

// pipe in output from real console
log.log('[33myellow[0m, [34mBlue[0m, [32mGreen[0m [35mMagenta[0m, [31mRed[0m');
```

## Contributing
Please make a PR or Issue

## License
[MIT](./license.txt)

## References
[256](https://github.com/jonasjacek/colors)  
[truecolor](https://gist.github.com/XVilka/8346728)  
[simple color](https://stackoverflow.com/a/2616912/4151489)  
https://misc.flogisoft.com/bash/tip_colors_and_formatting  
