import request from './request';

const reqUserLogin = (data) => request({
  url:'login',
  method: 'POST',
  data
});

export {
  reqUserLogin,
}

