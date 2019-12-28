# release process

the following process is used to release the latest changes of the product

## process

1. ensure local **master** branch is up-to-date ( `git pull master` )
2. determine release branch name ( `yarn release --dry-run` record proposed version number)
3. create release branch from **master** ( `git checkout -B release/<version-from-step-2>` e.g. **release/1.2.3** )
4. update solution ( `yarn release` )
5. create PR for release ( `git push --tags -u origin release/<version-from-step-2>` then create PR from repo UI )
6. review changes and merge to master
