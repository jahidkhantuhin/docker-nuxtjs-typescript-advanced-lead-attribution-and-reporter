export default {
  welcome: `Welcome to Foundation!`,
  copied: 'Copied',
  warning: {
    sure: `Are you sure?`,
    delete: `Are you sure you want to delete {details}?`,
    updateUserPassword: `You are about to update this user's password. Are you sure you want to proceed? This action cannot be reversed.`,
    logOut: `Are you sure you want to log out of the system?`,
  },
  message: {
    uploadingToGoogleDrive:
      'Report uploading to Google drive, Please stand by.',
    loginFormTitle: `Please login with your email and password below.`,
    pwResetTitle: `Password Rcovery`,
    pwRecoverFormTitle: `Please enter your email address below. If an account exists with it, further instructions will be sent to that email.`,
    pwRecoveryInstruction:
      'Please enter your new password twice and submit the form.',
    filters: `Filters`,
    supplyFilters: 'Please apply appropriate filters to see the data',
    noResultsFound: 'No Results were found, Please try changing your filters.',
    wip: 'This section is still a work in progress',
  },
  fields: {
    email: `E-mail`,
    password: `Password`,
    passwordConfirmation: `Password Confirmation`,
    name: `Name`,
    captcha: `Captcha Challenge`,
  },
  buttons: {
    logIn: `Log In`,
    logOut: `Log Out`,
    cancel: `Cancel`,
    resetPW: `Reset Password`,
    forgotPW: `Forgot Password?`,
    back: `Back`,
    create: `Create {item}`,
    submit: `Submit`,
    apply: `Apply`,
  },
  alert: {
    success: {
      driveUpload: 'Report successfully uploaded to Google Drive',
      login: `You are now logged in!`,
      logout: `You are now logged out!`,
      deleteOne: `{item} successfully deleted`,
      deleteMany: `The items were successfully deleted`,
      update: `Update completed`,
      create: `{item} created`,
      pwResetEmail: `Please check your email for further instructions`,
      pwResetDone: `Your password is now reset. Please use the new password to log in`,
    },
    error: {
      account: {
        noMatch: `No such user was found.`,
        loginFailed: `Could not login. Please check your credentials.`,
        pwResetTokenExpired: `Please provide the current password`,
      },
      validation: {
        required: `This input is required`,
        maxLength: `The input cannot be longer than {maxLength} characters`,
        invalidCharacters: `The value cannot contain {type}`,
        email: `Must be a proper email address`,
        passwordTooShort: `The password is too short. Please enter at least {minLength} characters`,
        passwordRequirement: `The password must have at least 1 {requirement}`,
        passwordMatch: `The passwords must match`,
        passwordMissingCurrent: `Please provide the current password`,
      },
      server: `A server error has occurred, please inform the IT Dept. about this.`,
      unknown: `An unkown error has occurred. Please inform the IT Dept. about this.`,
      tooManyAttempts: `Too many attempts. Please wait 60 seconds to try again.`,
      unauthorized: 'Unauthorized',
    },
  },
}