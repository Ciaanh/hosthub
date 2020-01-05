import Octokat from "octokat";

export default class GithubAPi {
  constructor(username, repo, branch) {
    this.username = username;
    this.repo = repo;
    this.branch = branch;
  }

  get(name, callback) {
    var repo = new Octokat().repos(this.username, this.repo);

    if (name.indexOf(".json") !== -1) {
      repo.contents(name).fetch(
        {
          ref: this.branch
        },
        function(err, result) {
          if (err) return callback(err);
          callback(err, {
            name: name,
            sha: result.sha,
            content: JSON.parse(atob(result.content))
          });
        }
      );
    } else {
      return callback("File type not supported.");
    }
  }

  update(name, data, token, callback) {
    var repo = new Octokat({ token: token }).repos(this.username, this.repo);
    var targetBranch = this.branch;

    repo.contents(name).fetch(
      {
        ref: targetBranch
      },
      function(err, result) {
        if (err) return callback(err);

        var changes = {
          branch: targetBranch,
          sha: result.sha,
          content: btoa(JSON.stringify(data)),
          message: "updated"
        };

        repo.contents(name).add(changes, function(err, res) {
          callback(err, res, name);
        });
      }
    );
  }
}
