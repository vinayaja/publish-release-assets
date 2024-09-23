import { getInput, setFailed, getBooleanInput } from "@actions/core";
import { context, getOctokit } from "@actions/github"; 

export async function run() {
    const token = getInput("gh-token");
    const releaseTag = getInput("release-tag");
    const assetNames = getInput("asset-names");
    const path = getInput("path") || `${process.env.GITHUB_WORKSPACE}`;
    const overwrite = getInput("overwrite") || false;
    const octoKit = getOctokit(token);
    const fs = require('fs');

    async function uploadAsset(assetName: string, path: string, releaseId: number){
        
        console.log(`Uploading asset ${assetName}`);
        const zipFiledata = fs.readFileSync(`${path}/${assetName}`);
 
        const upload =  (await octoKit.rest.repos.uploadReleaseAsset({
            owner: context.repo.owner,
            repo: context.repo.repo,
            release_id: releaseId,
            name: assetName,
            data: zipFiledata,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28',
                'content-type': 'application/octet-stream',
                'content-length': zipFiledata.length
            }
        }));
        
        console.log(upload.data);
    }

    try{  
                
        const releaseId =  (await octoKit.rest.repos.getReleaseByTag({
                owner: context.repo.owner,
                repo: context.repo.repo,
                tag: releaseTag,
                headers: {
                'X-GitHub-Api-Version': '2022-11-28'
                }
            })).data.id;
        
        let assetIds = (await octoKit.rest.repos.listReleaseAssets({
            owner: context.repo.owner,
            repo: context.repo.repo,
            release_id: releaseId,
            headers: {
            'X-GitHub-Api-Version': '2022-11-28'
            }
        })).data;

        interface asset {
            assetId: any;
            assetName: string;
          }
        let existingAssetNames: asset[] = []

        for(var assetId of assetIds)
        {
            let existingAssetName = (await octoKit.rest.repos.getReleaseAsset({
                owner: context.repo.owner,
                repo: context.repo.repo,
                release_id: releaseId,
                asset_id: assetId.id,
                headers: {
                'X-GitHub-Api-Version': '2022-11-28'
                }
            })).data.name;

            existingAssetNames.push({ assetId: assetId.id, assetName: existingAssetName });
        }

        const allAssetNames = assetNames.split(',');
            
        for(var assetName of allAssetNames)
        {
            for(var existingAssetName of existingAssetNames)
            {
                if(existingAssetName.assetName == assetName)
                {
                    console.log(`${assetName} already exists, checking overwrite input`);
                    if(overwrite)
                    {
                        await octoKit.rest.repos.deleteReleaseAsset({
                            owner: context.repo.owner,
                            repo: context.repo.repo,
                            release_id: releaseId,
                            asset_id: existingAssetName.assetId,
                            headers: {
                                'X-GitHub-Api-Version': '2022-11-28'
                                }
                        });
                        await uploadAsset(assetName,path,releaseId);
                        break;
                    }
                    else{
                        console.error(`${assetName} already exists, please set overwrite input as True`);
                        break;
                    }
                    
                }
                else{
                    console.log(`${assetName} does not exists, proceeding upload`);
                    await uploadAsset(assetName,path,releaseId);
                    break;
                };        
            }
            
        };
    }   catch(error){
        setFailed((error as Error)?.message ?? "Unknown error");
    }
    
}

if(!process.env.JEST_WORKER_ID){
    run();
}