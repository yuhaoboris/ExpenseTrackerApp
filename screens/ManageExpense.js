import { useState, useLayoutEffect, useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import IconButton from '../components/ui/IconButton'
import { GlobalStyles } from '../constants/styles'
import LoadingOverlay from '../components/ui/LoadingOverlay'
import { ExpensesContext } from '../store/expenses-context'
import ExpenseForm from '../components/ManageExpense/ExpenseForm'
import { storeExpense, updateExpense, deleteExpense } from '../util/http'
import ErrorOverlay from '../components/ui/ErrorOverlay'

function ManageExpense({ route, navigation }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()

  const expensesCtx = useContext(ExpensesContext)

  const editExpenseId = route.params?.expenseId
  const isEditing = !!editExpenseId

  const selectedExpense = expensesCtx.expenses.find((expense) => expense.id === editExpenseId)

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Edit Expense' : 'Add Expense',
      headerTintColor: 'white',
    })
  }, [navigation, isEditing])

  async function deleteExpenseHandler() {
    setIsLoading(true)
    try {
      await deleteExpense(editExpenseId)
      expensesCtx.deleteExpense(editExpenseId)
      navigation.goBack()
    } catch (error) {
      setError('Could not delete expense, please try again later!')
      setIsLoading(false)
    }
  }

  function cancelHandler() {
    navigation.goBack()
  }

  async function confirmhandler(expenseData) {
    setIsLoading(true)
    try {
      if (isEditing) {
        await updateExpense(editExpenseId, expenseData)
        expensesCtx.updateExpense(editExpenseId, expenseData)
      } else {
        const id = await storeExpense(expenseData)
        expensesCtx.addExpense({ ...expenseData, id })
      }
      navigation.goBack()
    } catch (error) {
      setError('Could not save data, please try again later!')
      setIsLoading(false)
    }
  }

  if (error && !isLoading) {
    return <ErrorOverlay message={error} />
  }

  if (isLoading) {
    return <LoadingOverlay />
  }

  return (
    <View style={styles.container}>
      <ExpenseForm
        submitButtonLabel={isEditing ? 'Update' : 'Add'}
        onCancel={cancelHandler}
        onSubmit={confirmhandler}
        defaultValues={selectedExpense}
      />

      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton icon="trash" color={GlobalStyles.colors.error500} size={36} onPress={deleteExpenseHandler} />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },
  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: 'center',
  },
})

export default ManageExpense
