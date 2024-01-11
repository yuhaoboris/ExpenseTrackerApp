import { FlatList } from 'react-native'
import ExpenseItem from './ExpenseItem'

function renderExpenseItem(itemData) {
  const itemProps = itemData.item
  return <ExpenseItem {...itemProps} />
}

function ExpensesList({ expenses }) {
  return <FlatList data={expenses} renderItem={renderExpenseItem} keyExtractor={(item) => item.id} />
}

export default ExpensesList
