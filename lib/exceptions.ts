// [UNUSED] Custom errors cho Stripe plan — không được import ở đâu cả. Có thể xóa.
export class RequiresProPlanError extends Error {
  constructor(message = "This action requires a pro plan") {
    super(message)
  }
}
