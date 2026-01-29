// 이 파일에 import 하시고 habitRouter.use('/:habitId', 000Router); 추가
// 
// **작성하신 route 파일** (habits.route.js 제외)
// API 경로중에 /habits/:habitId를 제외하고 남은 부분 쓰시면 됩니다! 예를 들어 
// 000Router.post('/habits/:habitId/example', ...) -> 000Router.post('/example', ...)
// 
//중요! const 000Router = express.Router({ mergeParams: true }) 
// { mergeParams: true }<--- 이 부분을 추가해야 부모로부터 studyId를 받을 수 있습니다.
// 
import habitRouter from './habits.routes.js';

export default habitRouter;
