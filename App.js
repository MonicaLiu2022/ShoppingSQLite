import { StatusBar } from 'expo-status-bar';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';

export default function App() {
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [items, setItems] = useState([]);

  const db = SQLite.openDatabase('listdb.db');

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists list (id integer primary key not null, product text, amount text);');
    }, null, updateList);
  }, []);

  //save item
  const saveItem = () => {
    db.transaction(tx => {
      tx.executeSql('insert into list (product, amount) values (?, ?);',
        [product, amount]);
    }, null, updateList)
  }

  //update list
  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from list;', [], (_, { rows }) =>
        setItems(rows._array)
      );
    }, null, null);
  }

  //delete item
  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from list where id = ?;`, [id]);
      }, null, updateList
    )
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={{ marginTop: 30, fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1 }}
        placeholder='Product'
        onChangeText={product => setProduct(product)}
        value={product}>
      </TextInput>
      <TextInput
        style={{ marginTop: 5, marginBottom: 5, fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1 }}
        placeholder='Amount'
        onChangeText={amount => setAmount(amount)}
        value={amount}>
      </TextInput>
      <Button
        onPress={saveItem} title="Save">
      </Button>
      <Text style={{ marginTop: 30, fontSize: 20 }}>Shopping List</Text>
      <FlatList
        style={{ marginLeft: '5%' }}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) =>
          <View style={styles.container}>
            <Text>{item.product},{item.amount}</Text>
            <Text
              style={{ color: '#0000ff' }}
              onPress={() => deleteItem(item.id)}>
              bought
            </Text>
          </View>}
        data={items}>
      </FlatList>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
