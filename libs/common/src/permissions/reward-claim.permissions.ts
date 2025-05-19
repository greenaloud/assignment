const REWARD_CLAIM_RESOURCE = 'reward-claim';

export enum RewardClaimPermission {
  READ = `${REWARD_CLAIM_RESOURCE}:read`,
  WRITE = `${REWARD_CLAIM_RESOURCE}:write`,
  DELETE = `${REWARD_CLAIM_RESOURCE}:delete`,
}
