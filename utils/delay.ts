import { messagingConsts } from '@constants/messagingConsts';

export async function delay(ms: number = messagingConsts.SHORT_DELAY_MS): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
}
