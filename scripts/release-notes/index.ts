import axios from 'axios';
import dedent from 'dedent';
import fs from 'fs';

const main = async () => {
  let requests: any[] = [];
  let page: number = 1;

  while (1) {
    const url = `https://api.github.com/repos/inevitable-changes/bento/pulls?state=closed&page=${page}`;
    const response = await axios.get(url);
    const closedPullRequests = response.data;
    console.log(closedPullRequests.length, page);

    if (closedPullRequests.length === 0) {
      break;
    } else {
      page++;
      requests = [...requests, ...closedPullRequests];
    }
  }

  const { web, landing } = requests.reverse().reduce(
    (acc, pullRequest) => {
      const title = pullRequest.title;
      const number = pullRequest.number;
      const user = pullRequest.user.login;

      if (title.startsWith('[landing]')) {
        acc.landing += `\n- ${title} by @${user} in #${number}`;
      } else {
        acc.web += `\n- ${title} by @${user} in #${number}`;
      }

      return acc;
    },
    {
      web: [],
      landing: [],
    },
  );

  console.log({ web, landing });

  const markdownFile = dedent`
    ## Web
    ${web}

    ## Landing
    ${landing}
  `;

  fs.writeFileSync('./release-notes.md', markdownFile);
};
main();
