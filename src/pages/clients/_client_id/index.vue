<template>
    <v-row 
      :class="{
          'my-6': true,
          'users-table': true,
        }"
    >
      <v-col lg="1" xl="1" md="1">
      </v-col>
      <v-col lg="10" xl="10" md="10" sm="12">
        <v-card 
          class="pt-8 pb-8 mb-12"
          max-width="344"
          height="140"
          >
          <v-row>
            <v-col>
              <v-sheet
                class="v-sheet--charts mx-auto "
                color="orange"
                elevation="12"
                max-width="calc(100% - 52px)"
                height="100px"
              >
              <v-icon style="padding-left: 40px; padding-top: 40px;" color="white">mdi-account-group</v-icon>
              </v-sheet>
            </v-col>
            <v-col>
                <p>
                  <strong>{{ ldrReport? 'LDR Report' : 'Total locations' }}
                  </strong>
                </p>
            </v-col>
          </v-row>
          <v-row class="mt-n12">
            <v-col>
              <v-icon class="pl-6">mdi-clock</v-icon>
              <span><small>Last updated at</small></span>
            </v-col>
          </v-row>
        </v-card>
        <v-card>
          <v-sheet
            class="v-sheet--offset mx-auto"
            color="cyan"
            elevation="12"
            max-width="calc(100% - 32px)"
          >
          
          <v-expansion-panels accordion>
            <v-expansion-panel
            >
              <v-expansion-panel-header disable-icon-rotate color="orange">
                <v-toolbar flat color="orange">
                  <v-toolbar-title>
                    {{ ldrReport ? 'Lead Detail Report' : 'Locations' }}
                  </v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn color="" nuxt :to="`/clients/${clientData}/locations/add`">
                    <v-icon left>mdi-account-plus</v-icon>
                  </v-btn>
                  <v-btn color="" class="ml-2" @click.native.stop="ldrReport = !ldrReport">
                  <v-icon left>mdi-graph</v-icon>
                </v-btn>
                </v-toolbar>
                <template v-slot:actions>
                  <v-icon color="teal">
                    mdi-filter
                  </v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
              <!-- Filters -->
              <v-row>
                <v-col lg="1" xl="" md="1">
                </v-col>
                <v-col lg="10" xl="12" md="10" sm="12">
                    <v-form @submit.prevent="">
                      <v-card-title>
                        <v-icon left>mdi-filter</v-icon>
                        Filter
                      </v-card-title>
                      <v-card-text>
                      <div v-if="ldrReport">
                        <v-row>
                          <v-col cols="8" sm="6" md="4" lg="3">
                            <!-- User type -->
                            <v-select
                              :items="roles"
                              :item-text="(item) => item.name"
                              :item-value="(item) => item.name"
                              :loading="loadingRoles"
                              label="Account Manager"
                              v-model="filters.role"
                              clearable
                            ></v-select>
                          </v-col>
                          <v-col cols="8" sm="6" md="4" lg="3">
                            <!-- Active -->
                            <v-select
                              v-model="filters.status"
                              :items="activeOptions"
                              clearable
                              label="Client Type"
                            ></v-select>
                          </v-col>
                          <v-col cols="8" sm="6" md="4" lg="3">
                            <!-- Order -->
                            <v-select
                              label="Order By"
                              :items="sortByOptions"
                              v-model="filters.sort_by"
                            ></v-select>
                          </v-col>
                          <v-col cols="8" sm="6" md="4" lg="3">
                            <v-select
                              label="Order"
                              :items="sortingOptions"
                              v-model="filters.sorting"
                            ></v-select>
                          </v-col>
                        </v-row> 
                      </div>
                      <div v-if="!ldrReport">
                        <v-row>
                          <v-col cols="8" sm="6" md="4" lg="3">
                            <!-- User type -->
                            <v-select
                              :items="roles"
                              :item-text="(item) => item.name"
                              :item-value="(item) => item.name"
                              :loading="loadingRoles"
                              label="Type"
                              v-model="filters.role"
                              clearable
                            ></v-select>
                          </v-col>
                          <v-col cols="8" sm="6" md="4" lg="3">
                            <!-- Search Term -->
                            <v-text-field
                              label="Search"
                              v-model="filters.search"
                              clearable
                              maxlength="250"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="8" sm="6" md="4" lg="3">
                            <!-- Active -->
                            <v-select
                              v-model="filters.status"
                              :items="activeOptions"
                              clearable
                              label="User Status"
                            ></v-select>
                          </v-col>
                          <v-col cols="8" sm="6" md="4" lg="3">
                            <!-- Order -->
                            <v-select
                              label="Order By"
                              :items="sortByOptions"
                              v-model="filters.sort_by"
                            ></v-select>
                          </v-col>
                          <v-col cols="8" sm="6" md="4" lg="3">
                            <v-select
                              label="Order"
                              :items="sortingOptions"
                              v-model="filters.sorting"
                            ></v-select>
                          </v-col>
                        </v-row> 
                      </div>
                    </v-card-text>
                      <v-card-actions class="">
                        <v-spacer></v-spacer>
                        <v-btn color="orange">
                          <v-icon left>mdi-check</v-icon>
                        </v-btn>
                        <v-btn link nuxt to="/users">
                          <v-icon left>mdi-cancel</v-icon>
                        </v-btn>
                      </v-card-actions>
                    </v-form>
                </v-col>
              </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-sheet>
          <!-- users list -->
          <div v-if="ldrReport">
          <v-data-table
          :loading="busy"
          :options.sync="tableOptions"
          :items="corUsers"
          :headers="corTableHeaders"
          :items-per-page="itemsPerPage"
          :page="page"
          :footer-props="{
            'items-per-page-options': itemsPerPageOptions,
          }"
          @pagination="handlePaginationChange"
          class="elevation-1 transparent"
          >
            <template #item.status="{ item }">
              <nuxt-link class="client-link" :to="`/clients/${item.id}`">
              {{ item.status }}
              </nuxt-link>
            </template>
            <template #item.num_of_locations="{ item }">
              <nuxt-link class="client-link" :to="`/clients/${item.id}`">
              {{ item.num_of_locations }}
              </nuxt-link>
            </template>
            <template #item.account_manager_id="{ item }">
              <nuxt-link class="client-link" :to="`/clients/${item.id}`">
              <span v-if="item && item.account_manager"
                >{{ item.account_manager.first_name }}
                {{ item.account_manager.last_name }}
              </span>
              </nuxt-link>
            </template>
            <template #item.name="{ item }">
              <nuxt-link class="client-link" :to="`/clients/${item.id}`">
                <span>{{ item.last_name }} {{ item.first_name }}</span>
              </nuxt-link>
            </template>
          </v-data-table>
        </div>
        <div v-if="!ldrReport">
          <v-data-table
          :loading="busy"
          :options.sync="tableOptions"
          :items="users"
          :headers="tableHeaders"
          :items-per-page="itemsPerPage"
          :page="page"
          :footer-props="{
            'items-per-page-options': itemsPerPageOptions,
          }"
          @pagination="handlePaginationChange"
          class="elevation-1 transparent"
        >
          <template #item.status="{ item }">
            <nuxt-link class="client-link" :to="`/clients/${$router.currentRoute.params.client_id}/locations/${item.id}`">
            {{ item.status }}
            </nuxt-link>
          </template>
          <template #item.num_of_locations="{ item }">
            <nuxt-link class="client-link" :to="`/clients/${$router.currentRoute.params.client_id}/locations/${item.id}`">
            {{ item.num_of_locations }}
            </nuxt-link>
          </template>
          <template #item.account_manager_id="{ item }">
            <nuxt-link class="client-link" :to="`/clients/${$router.currentRoute.params.client_id}/locations/${item.id}`">
            <span v-if="item && item.account_manager"
              >{{ item.account_manager.first_name }}
              {{ item.account_manager.last_name }}
            </span>
            </nuxt-link>
          </template>
          <template #item.name="{ item }">
            <nuxt-link class="client-link" :to="`/clients/${$router.currentRoute.params.client_id}/locations/${item.id}`">
              <span>{{ item.name }}</span>
            </nuxt-link>
          </template>
          <template #item.actions="{ item }">
                <v-btn 
                  class="ml-n6"
                  small
                  plain 
                  color="orange" 
                  dark
                  @click="$router.push(`/clients/${$router.currentRoute.params.client_id}/locations/${item.id}/edit`)"
                  >
                  <v-icon>mdi-pen</v-icon>
                  <!-- Actions -->
                </v-btn>
                <v-btn 
                  small
                  plain 
                  color="grey" 
                  dark
                  >
                  <v-icon>mdi-delete</v-icon>
                  <!-- Actions -->
                </v-btn>
          </template>
          </v-data-table>
        </div>
        </v-card>
      </v-col>
    </v-row>
  </template>
  
  <script lang="ts">
  import {
    defineComponent,
    onMounted,
    onBeforeMount,
    ref,
    useRoute,
    useRouter,
    useStore,
    watch,
    useContext,
  } from '@nuxtjs/composition-api'
  import { IBreadcrumbs } from '@/store'
  
  import useUsers from '../../../services/useUsers'
  import useClientRecords from '../../../services/useClientRecords'
  import useClientLocations from '../../../services/useClientLocations'
  import { Dictionary } from '../../../node_modules/@types/lodash'
  import isUserAllowedToEdit from '../../../utils/isUserAllowedToEdit'
  import clientLocation from '../../../report/clientLocation'
  import clientList from '../../../report/clients'
  import corReportList from '../../../report/cor-report'
  // import swalMixin, { showConfirmDialog, showToast } from '~/utils/swalMixin'
  
  // we are naming these based on the API requirements
  interface IUsersFilter {
    role?: number | null
    search?: string | null
    status?: string | null
    sort_by?: string
    sorting: 'asc' | 'desc'
  }
  
  interface IFilterSelectOption {
    text: string
    value: string | number | boolean | null | Array<string | number | boolean>
  }
  
  export default defineComponent({
    middleware: 'isAuthenticated',
    setup(props) {
      const ldrReport = ref(false)
      const itemsPerPageOptions = ref([20, 50, 100, 500])
      const itemsPerPage = ref(itemsPerPageOptions.value[0])
      const page = ref(1)
      const context = useContext()
  
      const store = context.store
      const router = useRouter()
      const route = useRoute()
      const usersApi = useClientRecords()
      const busy = ref(false)
      const clientData = ref(route.value.params.client_id,)
      // const $swal2 = swalMixin((parent as any).$swal as any)
  
      // set the page breadcrumbs
      const breadcrumbs: IBreadcrumbs[] = [
        {
          text: `Dashboard`,
          to: `/`,
        },
        {
          text: `Users`,
          to: `/users`,
        },
      ]
  
      const pageTitle = `Users`
  
      store.dispatch('setPageHeading', { pageTitle, breadcrumbs })
  
      // filters
      const defaultFilterValus: IUsersFilter = {
        role: null,
        search: null,
        status: 'active',
        sort_by: `first_name`,
        sorting: 'asc',
      }
      const filters = ref<IUsersFilter>(defaultFilterValus)
  
      const activeOptions: IFilterSelectOption[] = [
        {
          text: `Any`,
          value: null,
        },
        {
          text: `Active Only`,
          value: `active`,
        },
        {
          text: `Disabled Only`,
          value: `inactive`,
        },
      ]
  
      const sortByOptions: IFilterSelectOption[] = [
        {
          text: `Name`,
          value: `first_name`,
        },
        {
          text: `Active Status`,
          value: `status`,
        },
      ]
  
      const sortingOptions: IFilterSelectOption[] = [
        { text: `Ascending`, value: `asc` },
        { text: `Descending`, value: `desc` },
      ]
  
      const handleFilterApply = () => {
        router.push({
          path: router.currentRoute.path,
          query: {
            page: page.value.toString(),
            itemsPerPage: itemsPerPage.value.toString(),
            ...(filters.value as Dictionary<
              string | (string | null)[] | null | undefined
            >),
          },
        })
      }
  
      // users
      // const users = clientLocation
      const users = ref()
      const corUsers = corReportList
      const pagination = ref({
        total: 0,
      })
  
      const getUsers = () => {
        if (busy.value === false) {
          // first, transform the sort_by filter to use with the
          // axios request
          const appliedFilters = {
            ...filters.value,
            sort_by:
              filters.value.sort_by + `:` + filters.value.sorting.toLowerCase(),
          }
          busy.value = true
          usersApi
            .clientById(router.currentRoute.params.client_id)
            .then((response) => {
              users.value = response.data.data.locations
              pagination.value = response.data.data.pagination
            })
            .catch((error) => {
              console.log(`getUsers error`, ...error.repose)
            })
            .finally(() => (busy.value = false))
        }
      }
  
      // roles
      const roles = ref([])
      const loadingRoles = ref(false)
  
      // const getRoles = () => {
      //   loadingRoles.value = true
      //   usersApi
      //     .getRoles()
      //     .then(
      //       ({ data }) =>
      //         (roles.value = data.data.filter(
      //           // exclude super admin
      //           (item: { name: string | string[] }) =>
      //             !item.name.includes('super admin')
      //         ))
      //     )
      //     .catch(({ response }) => console.log(`getRoles error`, response))
      //     .finally(() => (loadingRoles.value = false))
      // }
  
      // data table
      const tableHeaders = ref([
      {
        text: ``,
        align: `start`,
        sortable: false,
        width: '130px',
        value: `actions`,
      },
      {
        text: `Location-name`,
        align: `start`,
        sortable: true,
        value: `name`,
      },
      {
        text: `Location-status`,
        align: `start`,
        sortable: true,
        value: `status`,
      },
      
      {
        text: `Account Manager`,
        align: `start`,
        sortable: true,
        value: `account_manager`,
      },
      {
        text: `Website`,
        align: `start`,
        sortable: true,
        value: `website`,
      },
      {
        text: `Created`,
        align: `start`,
        sortable: true,
        value: `created_at`,
      },

      
    ])

    const corTableHeaders = ref([
    {
      text: `Client`,
      align: `start`,
      sortable: true,
      value: `location.name`, // @TODO: change to fullname

      width: '340px',
      minWidth: '340px',
    },
    
    {
      text: `Account manager`,
      align: `start`,
      sortable: true,
    
      value: `location.account_manager`,
    
      width: '150px',
    },
    {
      text: `Total Leads`,
      align: `start`,
      value: `total_leads`,
      width: '130px',
    },
    {
      text: `Total Trends`,
      align: `start`,
      value: `total_trends`,
      width: '130px',
    },
    
  
    {
      text: `Calls`,
      align: `start`,
      value: `total_calls`,
      width: '100px',
    },
    {
      text: `Forms`,
      align: `start`,
      value: `total_forms`,
      width: '100px',
    },
    {
      text: `Chats`,
      align: `start`,
      value: `total_chats`,
      width: '100px',
    },
    {
      text: `Aggregate Spend`,
      align: `start`,
      value: `total_aggregate_cost`,
      width: '150px',
    },
    {
      text: `Total Budget`,
      align: `start`,
      value: `total_budget`,
      width: '150px',
    },
    {
      text: `Predicted Spend`,
      align: `start`,
      value: `predicted_spend`,
      width: '150px',
    },
    {
      text: `% of Budget Spent`,
      align: `start`,
      value: `percentageOf_budget_spent`,
      width: '150px',
    },
    {
      text: `CPL`,
      align: `start`,
      value: `total_cpl`,
      width: '80px',
    },
    {
      text: `Adwords Leads`,
      align: `start`,
      value: `total_adwords_leads`,
      width: '150px',
    },
    {
      text: `Adwords Spend`,
      align: `start`,
      value: `total_adwords_cost`,
      width: '150px',
    },
    {
      text: `Adwords Budget`,
      align: `start`,
      value: `location.adwords_budget`,
      width: '150px',
    },
    {
      text: `Adwords # of days live in selected time period`,
      align: `start`,
      value: ``,
      width: '150px',
    },
    {
      text: `Adwords CPL`,
      align: `start`,
      value: `adword_cpl`,
      width: '150px',
    },
    {
      text: `Facebook Leads`,
      align: `start`,
      value: `total_facebook_leads`,
      width: '150px',
    },
    {
      text: `Facebook Spend`,
      align: `start`,
      value: `total_facebook_cost`,
      width: '150px',
    },
    {
      text: `Facebook Budget`,
      align: `start`,
      value: `location.facebook_budget`,
      width: '150px',
    },
    {
      text: `Facebook # of days live in selected time period`,
      align: `start`,
      value: ``,
      width: '150px',
    },
    {
      text: `Facebook CPL`,
      align: `start`,
      value: `facebook_cpl`,
      width: '150px',
    },
    {
      text: 'G',
      value: 'total_booked',
      width: '70px',
    },
    {
      text: 'R',
      value: 'total_not_booked',
      width: '70px',
    },
    {
      text: 'O',
      value: 'total_voice_mail_booking',
      width: '70px',
    },
    {
      text: 'Y',
      value: 'total_missed',
      width: '70px',
    },
    {
      text: 'B',
      value: 'total_irrelevant',
      width: '70px',
    },    
  ])
  
      const tableOptions = ref<any>({})
  
      watch(
        tableOptions,
        () => {
          if (tableOptions.value.sortBy[0]) {
            filters.value.sort_by =
              tableOptions.value.sortBy[0] === 'fullname'
                ? 'first_name'
                : tableOptions.value.sortBy[0]
            filters.value.sorting = tableOptions.value.sortDesc[0]
              ? 'desc'
              : 'asc'
          }
  
        //   handleFilterApply()
        },
        { deep: true }
      )
  
      const handleDeleteUser = (id: any) => {
        // showConfirmDialog($swal2, {
        //   title: 'Are you sure you want to delete this user?',
        //   text:
        //     'This action is permanent. If you delete this user, all of their data will be deleted as well. Are you certain you want to proceed with this action?',
        //   icon: 'warning',
        // }).then(async (result: any) => {
        //   if (result.isConfirmed) {
        //     busy.value = true
        //     await usersApi.deleteUser(id)
        //     showToast($swal2, {
        //       title: 'User deleted',
        //       icon: 'error',
        //     })
        //     busy.value = false
        //     getUsers()
        //   }
        // })
            // usersApi.deleteUser(id)
            getUsers()
  
      }
  
      const handlePaginationChange = (e: any) => {
        itemsPerPage.value = e.itemsPerPage === -1 ? 500 : e.itemsPerPage
        page.value = e.page
        // handleFilterApply()
        getUsers()
      }
  
      const loadFiltersFromURL = () => {
        const query = route.value.query
        if (query.page) {
          page.value = +query.page
          delete query['page']
        } else {
          page.value = 1
        }
        if (query.itemsPerPage) {
          itemsPerPage.value = +query.itemsPerPage
          delete query['itemsPerPage']
        } else {
          itemsPerPage.value = 20
        }
        filters.value = { ...defaultFilterValus, ...query }
      }
  
      // others
      watch(route, () => {
        // loadFiltersFromURL()
        getUsers()
      })
  
      onBeforeMount(() => {
        // loadFiltersFromURL()
      })
  
      onMounted(() => {
        getUsers()
        // getRoles()
      })
  
      return {
        isUserAllowedToEdit,
        filters,
        activeOptions,
        sortByOptions,
        sortingOptions,
        handleFilterApply,
        roles,
        loadingRoles,
        users,
        pagination,
        busy,
        tableHeaders,
        itemsPerPage,
        itemsPerPageOptions,
        tableOptions,
        handleDeleteUser,
        handlePaginationChange,
        page,
        ldrReport,
        corUsers,
        corTableHeaders,
        clientData,
      }
    },
    head: {
      title: 'Locations',
    },
  })
  </script>
  
  <style scoped lang="scss">
  .user-name {
    /* position: relative;
    top: -6px;
    left: 5px; */
  }
  .v-sheet--offset {
      top: -24px;
      position: relative;
  }
  .v-sheet--charts {
      top: -54px;
      position: relative;
  }
  .users-table .v-data-table {
    padding-left: 40px;
  }
  </style>
  