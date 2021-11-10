import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Card, Icon, ListItem } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config';
import MyHeader from '../components/MyHeader';

export default class MyDonationScreen extends Component {
  static navigationOptions = { header: null };

  constructor() {
    super();
    this.state = {
      donorId: firebase.auth().currentUser.email,
      allDonations: [],
      donorName: '',
    };
    this.requestRef = null;
  }
  sendNotification = (bookDetails, requestStatus) => {
    var requestId = bookDetails.request_id;
    var donorId = bookDetails.donor_id;
    db.collection('allNotifications')
      .where('request_id', '==', requestId)
      .where('donor_id', '==', donorId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var message = '';
          if (requestStatus === 'BookSent') {
            message = this.state.donorName + ' has sent you this book';
          } else {
            message =
              this.state.donorName + ' has shown interest in donating the book';
          }
          db.collection('allNotifications').doc(doc.id).update({
            message: message,
            notification_status: 'unread',
            date: firebase.firestore.FieldValue.serverTimestamp(),
          });
        });
      });
  };
  getDonorDetails = (donorId) => {
    db.collection('users')
      .where('email_id', '==', donorId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            donorName: doc.data().first_name + ' ' + doc.data().last_name,
          });
        });
      });
  };
  
  sendBook = (bookDetails) => {
    if (bookDetails.request_status === 'BookSent') {
      var requestStatus = 'Donor Interested';
      db.collection('allDonations').doc(bookDetails.doc_id).update({
        request_status: 'Donor Interested',
      });
      this.sendNotification(bookDetails, requestStatus);
    } else {
      var requestStatus = 'Book Sent';
      db.collection('allDonations').doc(bookDetails.doc_id).update({
        request_status: 'Book Sent',
      });
      this.sendNotification(bookDetails, requestStatus);
    }
  };
  getAllDonations = () => {
    this.requestRef = db
      .collection('allDonations')
      .where('donor_id', '==', this.state.donorId)
      .onSnapshot((snapshot) => {
        var allDonations = [];
        snapshot.docs.map((doc) => {
          var donation = doc.data();
          donation['doc_id'] = doc.id;
          allDonations.push(donation);
        });
        this.setState({
          allDonations: allDonations,
        });
      });
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => (
    <ListItem
      key={i}
      title={item.book_name}
      subtitle={
        'Requested By : ' +
        item.requested_by +
        '\nStatus : ' +
        item.request_status
      }
      leftElement={<Icon name="book" type="font-awesome" color="#696969" />}
      titleStyle={{ color: 'black', fontWeight: 'bold' }}
      rightElement={
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.sendBook(item);
          }}>
          <Text style={{ color: '#ffff' }}>
            {item.request_status === 'Book Sent' ? 'Book Sent' : 'Send Book'}
          </Text>
        </TouchableOpacity>
      }
      bottomDivider
    />
  );
  componentDidMount() {
    this.getAllDonations();
    this.getDonorDetails(this.state.donorId);
  }
  componentWillUnmount() {
    this.requestRef();
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader navigation={this.props.navigation} title="My Donations" />
        <View style={{ flex: 1 }}>
          {this.state.allDonations.length === 0 ? (
            <View style={styles.subtitle}>
              <Text style={{ fontSize: 20 }}>List of all Book Donations</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.allDonations}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff5722',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    elevation: 16,
  },
  subtitle: {
    flex: 1,
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
