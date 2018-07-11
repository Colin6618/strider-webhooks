var request = require('../lib/request');
var utils = require('../lib/utils');

var data = {time: '2017-03-15T13:26:26.021Z', exitCode: undefined}

var job = {
  __v: 0,
  type: 'TEST_ONLY',
  user_id: '5863361935f7cd3b165b7954',
  project: {
    _id: '58635f98314fae52bd994497',
    name: 'hanyuzhi/react-bio',
    display_name: 'hanyuzhi/react-bio',
    display_url: 'http://gitlab.meizu.com/hanyuzhi/react-bio',
    creator: {
      _id: '5863361935f7cd3b165b7954',
      account_level: 1,
      hash: '$2a$10$iJF1XInUTx3Yc6Etk4/DFe7dbRaebsmIQ.TnBUaKb5eFjSQW0TiLO',
      salt: '$2a$10$iJF1XInUTx3Yc6Etk4/DFe',
      created: '2016-12-28T03:48:41.991Z',
      email: 'hanyuzhi@meizu.com',
      __v: 0,
      jobs: [],
      projects: [Object],
      accounts: [Object],
      isAdUser: false
    },
    __v: 63,
    provider: {id: 'gitlab', account: '0', repo_id: '373', config: [Object]},
    branches: [[Object], [Object]],
    prefetch_config: true,
    public: false
  },
  ref: {branch: 'master'},
  created: '2017-03-15T06:23:26.942Z',
  _id: '58635f98314fae52bd994497',
  errored: false,
  warnings: [],
  phases: {
    cleanup: {commands: []},
    deploy: {commands: []},
    test: {commands: []},
    prepare: {commands: []},
    environment: {commands: []}
  },
  trigger: {
    type: 'manual',
    timestamp: '2017-03-15T06:23:26.942Z',
    source: {page: 'config', type: 'UI'},
    // message: 'hanyuzhi TEST_AND_DEPLOY 18812345678',
    author: {
      id: '5863361935f7cd3b165b7954',
      email: 'hanyuzhi@meizu.com',
      image: 'https://s.gravatar.com/avatar/0f80c36d928c3ed616f722e428ab3df1?d=identicon'
    }
  },
  providerConfig: {
    auth: {type: 'ssh'},
    scm: 'git',
    url: 'git@gitlab.meizu.com:hanyuzhi/react-bio.git',
    owner: {
      name: 'hanyuzhi',
      username: 'hanyuzhi',
      id: 447,
      state: 'active',
      avatar_url: null,
      web_url: 'http://gitlab.meizu.com/u/hanyuzhi'
    },
    repo: 'http://gitlab.meizu.com/hanyuzhi/react-bio',
    pull_requests: 'none',
    whitelist: []
  },
  fromStriderJson: false
}
var payload = utils.makeDingDingRobotHook(data, job)
request('https://oapi.dingtalk.com/robot/send?access_token=f4f044e57d9b313db7fb5f18819f00890dc9a488220a947ed40f8f8888def652', payload)
