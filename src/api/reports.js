import request from '@/api/request';

const reqLineData = () => request({
  url:'reports/type/1',
  method:'GET'
});

export{
  reqLineData
}