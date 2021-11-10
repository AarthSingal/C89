import React from 'react';
import {
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TouchableHighlight,
} from 'react-native';
import { BookSearch } from 'react-native-google-books';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';
import db from '../config';

export default class BookRequestScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      bookName: '',
      reasonToRequest: '',
      requestId: '',
      isBookRequestActive: '',
      requestedBookName: '',
      bookStatus: '',
      userDocId: '',
      docId: '',
      dataSource: '',
      showFlatList: false,
    };
  }

  componentDidMount = () => {
    this.getBookRequest();
    this.getIsBookRequestActive();
    console.log('I am in component did mount');
  };

  renderItem = ({ item, i }) => {
    return (
      <TouchableHighlight
        style={styles.touchableopacity}
        activeOpacity={0.6}
        underlayColor={'blue'}
        onPress={() => {
          this.setState({
            showFlatList: false,
            bookName: item.volumeInfo.title,
          });
        }}
        botomDivider>
        <Text>{item.volumeInfo.title}</Text>
      </TouchableHighlight>
    );
  };

  getBooksFromApi = async (bookName) => {
    this.setState({
      bookName: bookName,
    });
    if (bookName.length > 2) {
      var books = await BookSearch.searchbook(
        bookName,
        'AIzaSyA3xU4UQkDGE1UN46FEM8teEedY8gc3ksk'
      );
      this.setState({
        dataSource: books.data,
        showFlatList: true,
      });
    }
  };

  getBookRequest = () => {
    var bookRequest = db
      .collection('bookRequests')
      .where('userId', '==', this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          console.log(data);
          if (data.bookStatus !== 'received') {
            this.setState({
              requestId: data.requestId,
              requestedBookName: data.bookName,
              bookStatus: data.bookStatus,
              docId: doc.id,
            });
            console.log('Book Name' + this.state.bookName);
          }
        });
      });
  };
  getIsBookRequestActive = () => {
    db.collection('users')
      .where('email_id', '==', this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            isBookRequestActive: doc.data().isBookRequestActive,
            userDocId: doc.id,
          });
        });
      });
  };
  createUniqueId = () => {
    return Math.random().toString(36).substring(7);
  };
  addRequest = async (bookName, reasonToRequest) => {
    var userId = this.state.userId;
    var randomRequestId = this.createUniqueId();
    var books = await BookSearch.searchbook(
        bookName,
        'AIzaSyA3xU4UQkDGE1UN46FEM8teEedY8gc3ksk'
      );
    db.collection('bookRequests').add({
      userId: userId,
      bookName: bookName,
      reasonToRequest: reasonToRequest,
      requestId: randomRequestId,
      bookStatus: 'requested',
      date: firebase.firestore.FieldValue.serverTimestamp(),
      image_link:books.data[0].volumeInfo.imageLinks.smallThumbnail
    });
    await this.getBookRequest();
    db.collection('users')
      .where('email_id', '==', userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection('users').doc(doc.id).update({
            isBookRequestActive: true,
          });
        });
      });
    this.setState({
      bookName: '',
      reasonToRequest: '',
      requestId: randomRequestId,
    });
    return alert('Book Requested Sucessfully');
  };

  sendNotification = () => {
    db.collection('users')
      .where('email_id', '==', this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var firstName = doc.data().first_name;
          var lastName = doc.data().last_name;
          //ToGetTheDonorIdAndBookName
          db.collection('allNotifications')
            .where('request_id', '==', this.state.requestId)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var donorId = doc.data().donor_id;
                var bookName = doc.data().book_name;
                //Targated User Id Is The Donor Id To Send Notification To The User
                db.collection('allNotifications').add({
                  targated_user_id: donorId,
                  message:
                    firstName +
                    ' ' +
                    lastName +
                    ' received the book ' +
                    bookName,
                  notification_status: 'unread',
                  book_name: bookName,
                });
              });
            });
        });
      });
  };

  receivedBooks = (bookName) => {
    var userId = this.state.userId;
    var requestId = this.state.requestId;
    db.collection('receivedBooks').add({
      user_id: userId,
      book_name: bookName,
      request_id: requestId,
      book_status: 'received',
    });
  };

  updateBookRequestStatus = () => {
    db.collection('bookRequests').doc(this.state.docId).update({
      bookStatus: 'received',
    });
    db.collection('users')
      .where('email_id', '==', this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection('users').doc(doc.id).update({
            isBookRequestActive: false,
          });
        });
      });
  };

  render() {
    if (this.state.isBookRequestActive === true) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View
            style={{
              borderColor: 'orange',
              borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              margin: 10,
            }}>
            <Text>Book Name</Text>
            <Text>{this.state.requestedBookName}</Text>
          </View>
          <View
            style={{
              borderColor: 'orange',
              borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              margin: 10,
            }}>
            <Text>Book Status</Text>
            <Text>{this.state.bookStatus}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              this.sendNotification();
              this.updateBookRequestStatus();
              this.receivedBooks(this.state.requestedBookName);
            }}
            style={{
              borderWidth: 1,
              borderColor: 'orange',
              backgroundColor: 'orange',
              width: 300,
              alignSelf: 'center',
              alignItems: 'center',
              height: 30,
              marginTop: 30,
            }}>
            <Text>I have received the book</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <MyHeader title="Request Books" navigation={this.props.navigation} />
          <KeyboardAvoidingView style={styles.keyBoardStyle}>
            <TextInput
              style={styles.formTextInput}
              placeholder="Enter the book name"
              onChangeText={(text) => {
                this.getBooksFromApi(text);
              }}
              onClear={() => {
                this.getBooksFromApi('');
              }}
              value={this.state.bookName}
            />
            {this.state.showFlatList ? (
              <FlatList
                data={this.state.dataSource}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => {
                  index.toString();
                }}
                style={{ marginTop: 10 }}
                enableEmptySections={true}
              />
            ) : (
              <View style={{ alignItems: 'center' }}>
                <TextInput
                  style={[styles.formTextInput, { height: 300 }]}
                  multiline={true}
                  numberOfLines={8}
                  placeholder="Why do you need the book"
                  onChangeText={(text) => {
                    this.setState({
                      reasonToRequest: text,
                    });
                  }}
                  value={this.state.reasonToRequest}
                />

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    this.addRequest(
                      this.state.bookName,
                      this.state.reasonToRequest
                    );
                  }}>
                  <Text>Request</Text>
                </TouchableOpacity>
              </View>
            )}
          </KeyboardAvoidingView>
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  keyBoardStyle: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  formTextInput: {
    width: '75%',
    height: 35,
    alignSelf: 'center',
    borderColor: '#ffab91',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },
  button: {
    width: '75%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#ff5722',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop: 20,
  },
  touchableopacity: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    width: '90%',
  },
});
