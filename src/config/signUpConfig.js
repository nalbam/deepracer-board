// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const signUpConfig = {
  header: 'Create an Account',
  hiddenDefaults: ['phone_number'],
  defaultCountryCode: '82',
  signUpFields: [
    {
      label: 'First name',
      key: 'given_name',
      required: true,
      displayOrder: 100,
      type: 'string'
    },
    {
      label: 'Last name',
      key: 'family_name',
      required: true,
      displayOrder: 101,
      type: 'string'
    },
  ]
};

export default signUpConfig
