export const DATABASE_URL: string = process.env.DATABASE_URL!;
export const AWS_REGION: string = process.env.AWS_REGION!;
export const AWS_ACCESS_KEY: string = process.env.AWS_ACCESS_KEY_ID!;
export const AWS_SECRET_KEY: string = process.env.AWS_SECRET_ACCESS_KEY!;
export const AWS_BUCKET: string = process.env.AWS_BUCKET!;
export const NEXT_PUBLIC_S3_BASE_URL: string = process.env.NEXT_PUBLIC_S3_BASE_URL!;
export const RAZORPAY_KEY_ID: string = process.env.RAZORPAY_KEY_ID!;
export const RAZORPAY_KEY_SECRET: string = process.env.RAZORPAY_KEY_SECRET!;
export const NEXT_PUBLIC_RAZORPAY_KEY_ID: string = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!;
export const AWS_ACCESS_KEY_ID: string = process.env.AWS_ACCESS_KEY_ID!;
export const AWS_SECRET_ACCESS_KEY: string = process.env.AWS_SECRET_ACCESS_KEY!;

export const AWS_AVT_COGNITO_ACCESS_KEY: string = process.env.AWS_AVT_COGNITO_ACCESS_KEY!;
export const AWS_AVT_COGNITO_SECRET_ACCESS_KEY: string = process.env.AWS_AVT_COGNITO_SECRET_ACCESS_KEY!;

export const COGNITO_CLIENT_ID: string = (process.env.COGNITO_CLIENT_ID ?? process.env.USER_POOL_CLIENT_ID)!;
export const COGNITO_CLIENT_SECRET: string = (process.env.COGNITO_CLIENT_SECRET ?? process.env.USER_POOL_CLIENT_SECRET)!;
export const USER_POOL_ID: string = process.env.USER_POOL_ID!;
export const USER_POOL_CLIENT_ID: string = (process.env.USER_POOL_CLIENT_ID ?? process.env.COGNITO_CLIENT_ID)!;
export const USER_POOL_CLIENT_SECRET: string = (process.env.USER_POOL_CLIENT_SECRET ?? process.env.COGNITO_CLIENT_SECRET)!;
export const AWS_COGNITO_REGION: string = (process.env.AWS_COGNITO_REGION ?? process.env.AWS_REGION)!;
export const BASE_AUTH_API_URL=process.env.NEXT_PUBLIC_BASE_AUTH_API_URL!;
export const BASE_API_URL=process.env.BASE_API_URL!;
