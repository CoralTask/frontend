name: "🐛 Bug"
description: "버그 제보/수정"
title: "[Bug] "
labels: ["bug"]
body:
  - type: textarea
    id: description
    attributes:
      label: "📄 설명"
      description: "버그에 대한 설명을 작성해 주세요."
      placeholder: "자세히 적을수록 좋습니다!"
    validations:
      required: true

  - type: checkboxes
    id: tasks
    attributes:
      label: "✅ 작업할 내용"
      description: "할 일을 체크박스 형태로 작성해주세요."
      options:
        - label: "작업 1"
        - label: "작업 2"
        - label: "작업 3"
    validations:
      required: true

  - type: textarea
    id: references
    attributes:
      label: "🙋🏻 참고 자료"
      description: "참고 자료가 있다면 작성해 주세요."
      placeholder: "링크/스크린샷/관련 문서 등을 첨부해주세요."
