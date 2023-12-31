<template>
  <div>
    <v-card v-if="(isAllowedToEdit)" elevation="0">
      <v-sheet
        class="v-sheet--offset mx-auto"
        color="orange"
        elevation="12"
        max-width="calc(100% - 32px)"
      >
      <v-card-title> {{ isEditing ? 'Update' : 'Create' }} a client </v-card-title>
    </v-sheet>
      <v-card-text>
        <v-form ref="form">
          <v-row>
            <v-col cols="6">
              <v-text-field
                dense
                filled
                rounded
                clear-icon="mdi-close-circle"
                clearable
                v-model="data['first_name']"
                placeholder="First name"
                counter="50"
                max="50"
                :rules="rules.first_name"
                :disabled="loading"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                dense
                filled
                rounded
                clear-icon="mdi-close-circle"
                clearable
                v-model="data['last_name']"
                :rules="rules.last_name"
                placeholder="Last name"
                :disabled="loading"
                counter="50"
                max="50"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                dense
                filled
                rounded
                clear-icon="mdi-close-circle"
                clearable
                :rules="rules.email"
                v-model="data['email']"
                placeholder="E-mail"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
              dense
                filled
                rounded
                label="Phone number *"
                clearable
                class="mb-3"
                v-model="data.phone_number"
                :rules="rules.phone_number"
                maxlength="250"
              >
              </v-text-field>
            </v-col>
            <v-col cols="6">
              <v-select
                dense
                filled
                rounded
                :items="[{text: 'Active', value: 'active'},
                {text: 'Inactive', value: 'inactive'}]"
                placeholder="Status"
                item-value="value"
                item-text="text"
                v-model="data['status']"
                :rules="rules.status"
                
              >
              </v-select>
            </v-col>
            <v-text-field
            dense
                filled
                rounded
              label="Personal website"
              clearable
              class="mb-3"
              v-model="data.personal_website"
              :rules="rules.personal_website"
              maxlength="250"
            >
            </v-text-field>
            <v-autocomplete
            dense
                filled
                rounded
              :items="accountManagers"
              item-value="id"
              :rules="rules.account_manager_id"
              v-model="data.account_manager_id"
              item-text="full_name"
              label="Account Manager *"
            >
            </v-autocomplete>
            
            
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          :color="'normal'"
          :disabled="loading || loadingRoles"
          @click="$emit('cancel')"
          >
          <v-icon left>mdi-cancel</v-icon>
          <!-- Cancel -->
          </v-btn
        >
        <v-btn
          :disabled="loading"
          :loading="loading"
          :color="'orange'"
          @click="submit"
          >
          <!-- {{ isEditing ? 'Update' : 'Create' }} -->
          <v-icon left>mdi-check</v-icon>
          </v-btn
        >
      </v-card-actions>
      <!-- user is editing password dialog -->
    </v-card>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  computed,
  useRoute,
  useContext,
  useRouter,
} from '@nuxtjs/composition-api'
import useApi from '../../services/useApi'
import useUsers from '../../services/useClientRecords'
import validateStrongPassword from '../../shared/ValidateStrongPassword'
import { ADMIN_ROLE, SUPER_ADMIN_ROLE } from '../../utils/UserEnums'
import isUserAllowedToEdit from '../../utils/isUserAllowedToEdit'
import useAxios from '../../plugins/useAxios'
// import swalMixin, { showToast } from '~/utils/swalMixin'

export default defineComponent({
  props: {
    userId: [Number, String],
    scope: {
      type: String,
      default: 'profile',
    },
  },
  setup(props) {
    const step1 = ref(true)
    const step2 = ref(false)
    const $axios = useAxios()

    const context = useContext()
    const { put } = useApi()
    const store = context.store

    const loginUser: any = (store.state as any).user.cred as any
    const uploader = ref(null)
    const passwordEditConfirmDialog = ref(false)
    const userImage = ref('')
    const userId: any = props.userId
    const route = useRoute()
    const router = useRouter()
    const newUserData = ref()
    const accountManagers = ref([
  {
    "id": 33,
    "first_name": "Brady",
    "last_name": "O'Keefe",
    "full_name": "Brady O'Keefe",
    "email": "wbrakus@yahoo.com",
    "job_title": "Automotive Body Repairer",
    "organisation": null,
    "pay_rate": "41.65",
    "phone_number": "+13017276147",
    "address": "41.65",
    "role": "user"
  },
  {
    "id": 34,
    "first_name": "Candice",
    "last_name": "Morar",
    "full_name": "Candice Morar",
    "email": "cwolff@bauch.com",
    "job_title": "Human Resource Director",
    "organisation": null,
    "pay_rate": "28.93",
    "phone_number": "+19516032433",
    "address": "28.93",
    "role": null
  },
  {
    "id": 35,
    "first_name": "Cassie",
    "last_name": "Mann",
    "full_name": "Cassie Mann",
    "email": "letitia.pollich@gmail.com",
    "job_title": "Video Editor",
    "organisation": null,
    "pay_rate": "97.38",
    "phone_number": "+14849930599",
    "address": "97.38",
    "role": null
  },
  {
    "id": 39,
    "first_name": "Cyrus",
    "last_name": "Hackett",
    "full_name": "Cyrus Hackett",
    "email": "abner.wiegand@gmail.com",
    "job_title": "Director Of Business Development",
    "organisation": null,
    "pay_rate": "18.46",
    "phone_number": "+19892459790",
    "address": "18.46",
    "role": null
  },
  {
    "id": 36,
    "first_name": "Ernestine",
    "last_name": "Kirlin",
    "full_name": "Ernestine Kirlin",
    "email": "emily58@moen.com",
    "job_title": "Architecture Teacher",
    "organisation": null,
    "pay_rate": "6.85",
    "phone_number": "+13253059184",
    "address": "6.85",
    "role": null
  },
  {
    "id": 30,
    "first_name": "fsfd",
    "last_name": "fsfsfs",
    "full_name": "fsfd fsfsfs",
    "email": "fsfs@wm4d.com",
    "job_title": null,
    "organisation": null,
    "pay_rate": null,
    "phone_number": null,
    "address": null,
    "role": "call scorer"
  },
  {
    "id": 29,
    "first_name": "fsfgs",
    "last_name": "fsfsdf",
    "full_name": "fsfgs fsfsdf",
    "email": "fsfsdf@wm4d.com",
    "job_title": null,
    "organisation": null,
    "pay_rate": null,
    "phone_number": null,
    "address": null,
    "role": "account manager"
  },
  {
    "id": 20,
    "first_name": "Jahid",
    "last_name": "Khan",
    "full_name": "Jahid Khan",
    "email": "jahid@wm4d.com",
    "job_title": null,
    "organisation": null,
    "pay_rate": null,
    "phone_number": null,
    "address": null,
    "role": "super admin"
  },
  {
    "id": 37,
    "first_name": "Kaley",
    "last_name": "Kerluke",
    "full_name": "Kaley Kerluke",
    "email": "donnelly.alison@gmail.com",
    "job_title": "Engineering Manager",
    "organisation": null,
    "pay_rate": "20.22",
    "phone_number": "+18438324505",
    "address": "20.22",
    "role": null
  },
  {
    "id": 38,
    "first_name": "Nyah",
    "last_name": "Welch",
    "full_name": "Nyah Welch",
    "email": "willa97@bruen.com",
    "job_title": "Explosives Expert",
    "organisation": null,
    "pay_rate": "65.76",
    "phone_number": "+19719153561",
    "address": "65.76",
    "role": null
  },
  {
    "id": 27,
    "first_name": "Test 1",
    "last_name": "jahid",
    "full_name": "Test 1 jahid",
    "email": "test1jahid@wm4d.com",
    "job_title": null,
    "organisation": null,
    "pay_rate": null,
    "phone_number": null,
    "address": null,
    "role": "user"
  },
  {
    "id": 40,
    "first_name": "test 1",
    "last_name": "arinze",
    "full_name": "test 1 arinze",
    "email": "test1arinze@wm4d.com",
    "job_title": null,
    "organisation": null,
    "pay_rate": null,
    "phone_number": null,
    "address": null,
    "role": "user"
  },
  {
    "id": 28,
    "first_name": "Test 2",
    "last_name": "jahid",
    "full_name": "Test 2 jahid",
    "email": "test2jahid@wm4d.com",
    "job_title": null,
    "organisation": null,
    "pay_rate": null,
    "phone_number": null,
    "address": null,
    "role": "user"
  },
  {
    "id": 31,
    "first_name": "Test 3",
    "last_name": "jahid",
    "full_name": "Test 3 jahid",
    "email": "test3jahid@wm4d.com",
    "job_title": null,
    "organisation": null,
    "pay_rate": null,
    "phone_number": null,
    "address": null,
    "role": "account manager"
  },
  {
    "id": 32,
    "first_name": "Test 4",
    "last_name": "jahid",
    "full_name": "Test 4 jahid",
    "email": "test4jahid@wm4d.com",
    "job_title": null,
    "organisation": null,
    "pay_rate": null,
    "phone_number": null,
    "address": null,
    "role": "account manager"
  }
])
    // const toast = ((context as any).parent as any).$toast
    const data = ref({
      id: '',
      first_name: '',
      last_name: '',
      email: '',
      status: '',
      phone_number: '',
      personal_website: '',
      account_manager_id: '',
    })
    const roles = ref([])
    const form = ref(null)
    const loading = ref(false)
    const loadingRoles = ref(true)
    const isEditing = userId && userId > 0
    const isEditingOtherUser = +userId !== loginUser.id
    const { 
      create,
      update,
      clientById,
      deleteClient, } = useUsers()
    // const $swal = swalMixin((parent as any).$swal as any)

    const fetchUser = async () => {
      try {
        loading.value = true
        const res = await clientById(userId)
        const userData = res.data?.data
        delete userData['scope']

        data.value = userData
        loading.value = false
        setTimeout(() => {
          ;(form.value as any).resetValidation()
        }, 50)
      } catch (e) {
        loading.value = false
      }
    }

    onMounted(async () => {
      if (isEditing) fetchUser()
      else {
        // loading.value = loadingRoles.value = false
      }
      // loadingRoles.value = true
      const user: any = (store.state as any).user.cred as any
      // if (user.role === ADMIN_ROLE || user.role === SUPER_ADMIN_ROLE) {
      //   const res = await getRoles()
      //   roles.value = res.data?.data
      // }
      // loadingRoles.value = false
    })

    const handleUpdateUser = async () => {
      try {
        step1.value = false
        step2.value = true
        passwordEditConfirmDialog.value = false
        loading.value = true
        let response = await update({
            id: route.value.params.client_id,
            first_name: data.value.first_name,
            last_name: data.value.last_name,
            email: data.value.email,
            phone_number: data.value.phone_number,
            status: data.value.status,
            personal_website: data.value.personal_website,
            account_manager_id: data.value.account_manager_id,
        })
            
        // router.replace('/users')
        // ;(context as any).emit('done')

        if (userImage.value) {
          await put('/meta/profile_picture', {
            meta_name: `profile_picture`,
            meta_value: userImage.value,
          })
          ;(context as any).$auth.fetchUser()
        }
        // showToast($swal, {
        //   title: 'User Updated',
        // })
        // ;(context as any).emit('done')
        loading.value = false
      } catch (e: any) {
        loading.value = false
        passwordEditConfirmDialog.value = false
        console.log(e.response)
      }
    }

    const submit = async () => {
      try {
        const vv = await (form.value as any).validate()
        if (vv) {
          loading.value = true

          if (isEditing) {
            handleUpdateUser()
          } else {
            loading.value = true
            let response = await create(data.value as any)
            newUserData.value = response.data.data
            // await createUserRole(response.data.data as any)
            router.replace('/clients')
            // ;(context as any).app.emit('done')
          //   showToast($swal, {
          //     title: 'User created',
          //   })
          }

          // Now setting profile if user setup.
        } else {
          // showToast($swal, {
          //   title: 'Errors in form.',
          //   icon: 'warning',
          // })
        }
      } catch (e: any) {
        console.log(e.response)
      }
    }
    const commonPasswordRules = [
      (v: string) => {
        if ((v && v.length === 0) || v === undefined || v === null) {
          return true
        }
        return (
          (v && v.length >= 8) || 'Passowrd must be 8 or more than 8 characters'
        )
      },
      validateStrongPassword,
    ]

    const userEditWarnOldPasswordToUseToChangeDetails =
      isEditing && !isEditingOtherUser
        ? 'Old password is required for updating your profile'
        : 'Old password is required'

    const rules = {
      first_name: [(v: string) => !!v || 'First Name is required'],
      last_name: [(v: string) => !!v || 'Last Name is required'],
      status: [(v: string) => !!v || 'Status is required'],
      email: [
        (v: string) => !!v || 'E-mail is required',
        (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      phone_number: [(v: string) => !!v || 'Phone is required'],
      account_manager_id: [
        (v: string | number) => !!v || 'Account Manager is required',
      ],
      personal_website: [
        (v: string) => {
          if (v) {
            return (
              /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(v) ||
              'Personal must be a valid url'
            )
          } else return true
        },
      ],
    }

    const rolesList = computed(() => {
      return (
        roles.value &&
        roles.value.filter((c: any) => {
          return c.name !== 'super admin'
        })
      )
    })

    const handleSelectProfilePicture = (file: any) => {
      if (file) {
        if (file.type.startsWith('image')) {
          var reader = new FileReader()
          var baseString: string = ''
          reader.onloadend = function () {
            baseString = reader.result as string
            let sizeInKB: number = +(file.size / 1024).toFixed(0)

            if (sizeInKB > 500) {
              // showToast($swal, {
              //   title: 'Image size should not be more than 500KB.',
              //   icon: 'warning',
              // })
              // @ts-ignore
              uploader.value.reset()
              return
            }
            userImage.value = baseString
          }

          reader.readAsDataURL(file)
        } else {
          // showToast($swal, {
          //   title: 'Please select an image.',
          //   icon: 'warning',
          // })
        }
      }
    }

    const isAllowedToEdit = computed(() => {
      const editingUser: any = data.value

      return isUserAllowedToEdit(
        editingUser,
        loginUser,
        route.value.path.includes('profile') ? 'profile' : null
      )
    })

    return {
      //state
      data,
      isEditing,
      loadingRoles,
      loading,
      roles,
      rules,
      form,
      passwordEditConfirmDialog,
      rolesList,
      uploader,
      isAllowedToEdit,
      isEditingOtherUser,
      step1,
      step2,
      newUserData,
      //methods
      submit,
      handleUpdateUser,
      handleSelectProfilePicture,
      accountManagers,
    }
  },
})
</script>


<style lang="scss">
// .body {
//   height: 400px;
//   overflow: auto;
// }
.v-input.radio-group .v-label {
  text-transform: capitalize;
}
.v-sheet--offset {
    top: -24px;
    position: relative;
}
</style>
