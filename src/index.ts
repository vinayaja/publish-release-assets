import { getInput, setFailed } from "@actions/core";
import { context, getOctokit } from "@actions/github"; 

export async function run() {
    const token = getInput("gh-token");
    const releaseTag = getInput("release-tag");
    const assetName = getInput("asset-name");

    const octoKit = getOctokit(token);

    try{  
        const fs = require('fs');        
        const releaseId =  (await octoKit.rest.repos.getReleaseByTag({
                owner: context.repo.owner,
                repo: context.repo.repo,
                tag: releaseTag,
                headers: {
                'X-GitHub-Api-Version': '2022-11-28'
                }
            })).data.id;

        const zipFiledata = fs.readFileSync(`${process.env.GITHUB_WORKSPACE}/${assetName}`);
 
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

    }   catch(error){
        setFailed((error as Error)?.message ?? "Unknown error");
    }
    
}

if(!process.env.JEST_WORKER_ID){
    run();
}