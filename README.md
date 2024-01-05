<h1>JavaScript Bot for Discord</h1>

This Bot is a work in progress JavaScript version of our Python Bot <a href='https://github.com/ItIzYe/Va'>Drippy</a>.
The Prefix is *#*. Please remember to NOT import the *node_modules* Folder and to REPLACE the token placeholder with your token. If you want to contribute on this project just fork it. I'll take a look at it and implement good Ideas into the project. Have fun with it!
See the Website <a href='https://itizye.github.io/Drippy.JS/'>Drippy.JS</a>

## Construction of Commands
For our commands we use the `callback` option rather than the `execute` option
a command should **ALWAYS** look like this:
```js
/** requires **/
module.exports = {
    name: String,
    description: String,
    // devOnly: Boolean,
    // testOnly: true,
    // options: Object[],
    // deleted: Boolean,

    callback: async (client, interaction) => {
        /** Code **/
    },
};
```
| Option    |                                                            desciption                                                             |
|-----------|:---------------------------------------------------------------------------------------------------------------------------------:|
| *devOnly* |          When set to `true`, only registered developers can use this Command. More about registering <a href="">here</a>          |
|*testOnly* | When set to `true`, the Command can only be used on the test-Server. More about registering a test-Server <a href="">here</a><br> |
|*deleted*           |        When set to `true`, the command gets removed from the active list without actually having to delete the source code        |

  
When finished creating a command, just restart the bot. **DO NOT CHANGE ANY CODE OTHER THAN CODE IN THE COMMAND FOLDER AND SELF-CREATED FOLDERS**



## Current working Commands
*- Kick Command*<br>
*- Ban Command*<br>
*- Clear Command*<br>
*- Info/Serverinfo*<br>
*-Help*<br>
*-Boost*<br>
*-Automod*<br>
*-Memberjoin/Guildjoin*<br>


## Currently Fixing Errors
*- Quiz Command*

## Currently not fully usable
*- Channelset Command*

## Currently working on
- [ ] Fix Errors in Quiz Command
- [ ] Complete Channelset Command
- [ ] Fix Errors in Clear Command
```
    ___     ___    ___       ___
   |   |   |   |   \  \     /  /
   |   |   |   |    \  \   /  /
   |   |   |   |     \  \ /  /
   |   |   |   |      \     /
   |   |   |   |       \   /
   |   |   |   |       |   |
   |   |   |   |       |   |
   |   |   |   |       |   |
   |___|   |___|       |___|

© 2022 @IIY Development and Partners
       Code can be used with
              Credits
```
