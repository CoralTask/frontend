---
name: Bug
about: 버그 수정
title: 'Issue : '
labels: bug
assignees: ''

---

body:
  - type: textarea
    attributes:
      label: 📄 설명
      description: 어떤 기능이 어떻게 버그가 생겼는지에 대한 설명을 작성해 주세요.
      placeholder: 자세히 적을수록 좋습니다!
    validations:
      required: true
  - type: textarea
    attributes:
      label: ✅ 작업할 내용
      description: 할 일을 체크박스 형태로 작성해주세요.
      placeholder: 최대한 세분화 해서 적어주세요!
    validations:
      required: true
  - type: textarea
    attributes:
      label: 🙋🏻 참고 자료
      description: 참고 자료가 있다면 작성해 주세요.
