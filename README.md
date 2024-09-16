# Get secrets from Azure Keyvault

Simple GitHub Action to fetch secrets from azure keyvault and save it as runtime env variables.  

## Inputs

- `keyvault-name` - Github Token or Pat Token (Required)
- `secret-names` - Secret names. pass single or multiple names with comma seperated values (Optional)
- `secreat-name-pattern` - secret name patter for eg, to retrive tokens with name config* pass value 'config' (Optional)

Note: Please login to azure with azure/login@v2 action first.

## Example

If you want to fetch all secrets

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
        release-tag: 'v1.0.0'
        build-number: '11.09.2024.${{ github.run_number }}'
        
```

### Output of this action

![alt text](image-1.png)