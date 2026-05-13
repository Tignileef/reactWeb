# 스마트 실습실 좌석 관리 시스템

React 기반의 컴퓨터 실습실 좌석 배정 및 관리 웹 시스템입니다. 사용자는 좌석을 선택해 입실과 퇴실을 처리할 수 있고, 사용 중인 좌석은 고장 신고를 통해 수리 필요 상태로 전환할 수 있습니다. 관리자는 수리 완료 처리와 전체 좌석 초기화를 수행할 수 있습니다.

## 주요 기능

- 좌석 36개의 실시간 상태 표시
- 입실, 퇴실, 자동 시간 종료 처리
- 전공 심화, 교양/기타, 자율 실습 유형 선택
- 좌석 고장 신고 및 관리자 수리 완료 처리
- 전체, 사용 가능, 사용 중, 수리 필요 필터
- 좌석 번호 검색
- 잔여 좌석, 사용 중 좌석, 수리 필요 좌석, 이용률 대시보드
- `localStorage`를 활용한 좌석 상태 저장

## 기술 스택

- React
- Vite
- JavaScript
- CSS
- GitHub Actions
- AWS S3 배포

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 Vite가 안내하는 로컬 주소로 접속합니다.

## 빌드 방법

```bash
npm run build
```

빌드 결과물은 `dist` 폴더에 생성됩니다.

## CI/CD 구성

GitHub Actions를 사용하여 `main` 브랜치에 push가 발생하면 자동으로 다음 작업을 수행합니다.

1. 저장소 코드 체크아웃
2. Node.js 환경 구성
3. 의존성 설치
4. React 프로젝트 빌드
5. AWS S3 버킷으로 `dist` 폴더 배포

GitHub repository의 `Settings > Secrets and variables > Actions`에서 아래 값을 등록해야 합니다.

| Secret 이름 | 설명 |
| --- | --- |
| `AWS_ACCESS_KEY_ID` | AWS Access Key |
| `AWS_SECRET_ACCESS_KEY` | AWS Secret Access Key |
| `AWS_REGION` | 배포 리전 예: `ap-northeast-2` |
| `S3_BUCKET_NAME` | 정적 웹 호스팅용 S3 버킷 이름 |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront 사용 시 배포 ID |

## 배포 URL

```txt
http://mybucket-20263602.s3-website-us-east-1.amazonaws.com
```

## 시연 영상

```txt
https://youtu.be/tHxhAFb_LPU
```
