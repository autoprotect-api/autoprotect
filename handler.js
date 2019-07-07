'use strict'

const Octokit = require('@octokit/rest')
const octokit = new Octokit({ auth: `${process.env.GITHUB_ACCESS_TOKEN}`})


module.exports.autoprotect = (event, context, callback) => {
  var msg = ''
  var response = {statusCode: 200, body: JSON.stringify({ message: msg })}

  const data = JSON.parse(event.body)

  if((data.hasOwnProperty('repository')) && (data.hasOwnProperty('ref')) && (data.hasOwnProperty('ref_type'))){

    const repo_name = data.repository.name
    const owner = data.repository.owner.login
    const ref = data.ref
    const ref_type = data.ref_type

    if((ref === 'master') && (ref_type === 'branch')){

      console.log(`Autoprotecting branch ${ref} for ${repo_name}`)

      octokit.repos.updateBranchProtection({
        owner: owner,
        repo: repo_name,
        branch: 'master',
        required_status_checks: null,
        enforce_admins: false,
        required_pull_request_reviews: null,
        restrictions: { teams: [], users: []}
      }).then(({ data, headers, status }) => {
          if(status === 200){
            msg = 'Autoprotect function executed successfully!'

            octokit.issues.create({
              owner: owner,
              repo: repo_name,
              title: `Autoprotected master branch of ${owner}/${repo_name}`,
              body: 'The master branch has been autoprotected @evgenyrahman'
            }).then(({ data, headers, status }) => {
              if(status === 200){
                console.log('Issue created');
              }
            })

          } else {
            msg = 'Autoprotect function exection failed'
          }
          console.log(msg)
      })
    } else {
      msg = 'Event was not for master branch'

      console.log(msg)
    }

  } else {
    msg = 'Event data did not contain sufficient reference information'

    console.log(msg)
  }

  response = {
                statusCode: 200,
                body: JSON.stringify({
                  message: msg,
                  input: event
                })
              }
  callback(null, response)
}
