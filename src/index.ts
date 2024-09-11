import { getInput, setFailed } from "@actions/core";
import { context, getOctokit } from "@actions/github"; 

export async function run() {
    const token = getInput("gh-token");
    const releaseTag = getInput("release-tag");
    const buildNumber = getInput("build-number");

    const octoKit = getOctokit(token);

    try{  
        const fs = require('fs');
        const uploadUrl =  (await octoKit.rest.repos.getReleaseByTag({
                owner: context.repo.owner,
                repo: context.repo.repo,
                tag: releaseTag,
                headers: {
                'X-GitHub-Api-Version': '2022-11-28'
                }
            })).data.upload_url.replace("{?name,label}",`?name=${buildNumber}.zip`);

        const headers: Headers = new Headers();
        headers.set('Content-Type', 'application/zip');
        headers.set('Accept', 'application/vnd.github+json');
        headers.set('Authorization', `Bearer ${token}`);

        const request: RequestInfo = new Request(uploadUrl, {
            method: 'Post',
            headers: headers,
            body: fs.createReadStream(`${process.env.GITHUB_WORKSPACE}/${buildNumber}.zip`)
          })

    }   catch(error){
        setFailed((error as Error)?.message ?? "Unknown error");
    }
    
}

if(!process.env.JEST_WORKER_ID){
    run();
}