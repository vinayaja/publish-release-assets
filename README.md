# Upload assets to release as artifacts

Simple GitHub Action to Upload assets to release as artifacts  

## Inputs

- `gh-token` - Github Token or Pat Token (Required)
- `release-tag` - Release Tag (Required)
- `asset-names` - comma seperated value for asset names (Required)
- `path` - Path to assets files, default is github workspace location
- `overwrite` - Set this true if you want to overwrite existing asset

## Example

### To upload multiple assets to release

```yml

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - uses: vinayaja/publish-release-assets@main
      with:
        gh-token: ${{ github.token }}
        release-tag: 'v1.1.0'
        asset-names: 'assetname1.zip,assetname.txt'
        
```

### To upload existing assets to release from specific path

```yml

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - uses: vinayaja/publish-release-assets@main
      with:
        gh-token: ${{ github.token }}
        release-tag: 'v1.1.0'
        asset-names: 'assetname1.zip,assetname.txt'
        overwrite: 'true'
        path: ${{ github.workspace }}/assets
        
```