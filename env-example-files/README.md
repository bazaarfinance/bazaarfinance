1. Copy these files to the project base directory.
2. Rename the suffix from the example files from `.env-envname-example` to `.env-envname`.
3. Edit the `.env-envname` files with your API or private keys
4. When adding a new environment requiring a new `.env-envname` file, add the new env file to the `.gitignore` file and add an example file for the environment to the `.env-example-files` dir.
5. Don't check in any actual `.env-envname` files.
6. For more info read here: https://github.com/motdotla/dotenv#should-i-have-multiple-env-files


