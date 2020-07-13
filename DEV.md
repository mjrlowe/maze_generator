# DEV.md

## Before a release

### Replace all version numbers with the new version number

Usually just a "replace all" will suffice for this.

Files which include the module version number:

* `package.json`
* `egg.json`
* Example code in the `examples` folder
* `createWidget.js`

### Make sure any new folders and files are included in `egg.json`

E.g:

```json
"files": [
  "README.md",
  "./mod.js",
  "./folder-name/*",
  "./another-folder/**/*",
  ],
```

### Update whether the new release is stable or not in `egg.json`

E.g:  

```json
"stable": false,
```
