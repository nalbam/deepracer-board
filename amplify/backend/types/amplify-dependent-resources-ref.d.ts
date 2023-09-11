export type AmplifyDependentResourcesAttributes = {
  "analytics": {
    "deepracerboard": {
      "Id": "string",
      "Region": "string",
      "appName": "string"
    }
  },
  "api": {
    "leagues": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    },
    "racers": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    }
  },
  "auth": {
    "deepracerboard040569fa": {
      "AppClientID": "string",
      "AppClientIDWeb": "string",
      "AppClientSecret": "string",
      "IdentityPoolId": "string",
      "IdentityPoolName": "string",
      "UserPoolId": "string",
      "UserPoolName": "string"
    }
  },
  "function": {
    "leagues": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "Name": "string",
      "Region": "string"
    },
    "racers": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "Name": "string",
      "Region": "string"
    }
  },
  "hosting": {
    "S3AndCloudFront": {
      "CloudFrontDistributionID": "string",
      "CloudFrontDomainName": "string",
      "CloudFrontOriginAccessIdentity": "string",
      "CloudFrontSecureURL": "string",
      "HostingBucketName": "string",
      "Region": "string",
      "S3BucketSecureURL": "string",
      "WebsiteURL": "string"
    }
  },
  "storage": {
    "leagues": {
      "Arn": "string",
      "Name": "string",
      "PartitionKeyName": "string",
      "PartitionKeyType": "string",
      "Region": "string",
      "StreamArn": "string"
    },
    "logos": {
      "BucketName": "string",
      "Region": "string"
    },
    "racers": {
      "Arn": "string",
      "Name": "string",
      "PartitionKeyName": "string",
      "PartitionKeyType": "string",
      "Region": "string",
      "SortKeyName": "string",
      "SortKeyType": "string",
      "StreamArn": "string"
    }
  }
}