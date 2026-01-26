# password.crypto.js 사용 가이드

## 패스워드 해시
```
import { hashPassword } from '../utils/password.crypto.js';
const { password } = req.body;
const hashedPassword = await hashPassword(password);
```

## 패스워드 검증
```
import { comparePassword } from '../utils/password.crypto.js';
const { password } = req.body;
const isValid = await comparePassword(password, study.password);
```p

### 주의사항

- 비밀번호는 절대 평문으로 DB에 저장하지 않습니다.
- hashPassword의 반환값은 API 응답에 포함하지 않습니다.
- 비밀번호 비교는 반드시 comparePassword를 사용합니다.
