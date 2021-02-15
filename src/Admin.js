import React from 'react';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class Payers extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      payers: [],
      payment: '',
      userId: '',
      userDate: new Date(),
    };

    this.postPayment = this.postPayment.bind(this);
  }

  sumPayments(payers) {
      let sumPayments = 0;
      Object.values(payers).forEach(payer => {
          payer.forEach(payment => {
              sumPayments += parseInt(payment.payment)
          })
      })

      return sumPayments;
  }

  componentDidMount() {
      axios.get('https://s3.amazonaws.com/buildchurchweb/payers.json', {headers: {'Content-Type': 'application/json'}})
          .then(res => {

            this.setState({
                payers: res.data,
                sumPayments: this.sumPayments(res.data)
            })
          })
  }

  postPayment() {
    let pattern = /^\d+$/;
    let day = this.state.userDate.getDate() > 9 ? this.state.userDate.getDate()  : '0' + this.state.userDate.getDate();
    let month = this.state.userDate.getMonth() + 1 > 9 ? this.state.userDate.getMonth() + 1  : '0' + (this.state.userDate.getMonth() + 1);
    let year  = this.state.userDate.getFullYear();
    let userDate = day + '/' + month + '/' + year;

    if(!pattern.test(this.state.payment)) {
        this.setState({payment: '', userId: ''})

        return
    }

    if(this.state.payment <= 0) {
        this.setState({payment: '', userId: ''})

        return
    }

    // /*
    axios({
      method: 'post',
      url: 'https://8zanfns4w4.execute-api.us-east-1.amazonaws.com/prod',
      data: {
        payment: this.state.payment,
        userId: this.state.userId,
        userDate
      },
      headers: {'Content-Type': 'application/json'}
    }).then(() => {
      axios.get('https://s3.amazonaws.com/buildchurchweb/payers.json', {headers: {'Content-Type': 'application/json'}})
          .then(res => {
              console.log(res);
              this.setState({
                payers: res.data,
                payment: '',
                userId: '',
                userDate: new Date(),
                sumPayments: this.sumPayments(res.data)
              })
          })
    })
    // */
  }

  render() {
    if(this.state.payers.length === 0) return <div>Loading...</div>
    // if(this.props.authState === 'signedIn' && this.props.authData) console.log('attributes', this.props.authData.attributes.sub);
    //   console.log(this.props.authState);

    return this.props.authState !== 'signedIn'
        ? null
        : (
      <div style={{
        display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center",
      }}>
          <div>Бюджет завершення будівництва церкви 1 000 000 грн. Пожертвування: {this.state.sumPayments} грн. Виконано: {(this.state.sumPayments / 1000000 * 100).toFixed(2)}%</div>

          {
              this.props.authData.attributes.sub === '8ad0066e-66ce-44a9-9c16-21e58e53e117' || this.props.authData.attributes.sub === '5145c4b8-5e5b-4270-9546-b2300abbd8d4'
                  ? <div style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", flexWrap: 'wrap', marginTop: 30}}>
                      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start"}}>
                          <label>дата пожертви:</label>
                          <DatePicker dateFormat="dd/MM/yyyy" locale='uk_UA' selected={this.state.userDate} onChange={date => this.setState({userDate: date})} />
                          {/*<input value={this.state.userDate} onChange={event => this.setState({userDate: event.target.value})} />*/}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", marginLeft: 20}}>
                        <label>cума пожертви:</label>
                        <input value={this.state.payment} onChange={event => this.setState({payment: event.target.value})} />
                    </div>
                      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", marginLeft: 20}}>
                          <label>анонімний код:</label>
                        <input value={this.state.userId} onChange={event => this.setState({userId: event.target.value})} />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", marginLeft: 20}}>
                          <div style={{height: 15}}/>
                          <button onClick={() => this.postPayment()} > додати пожертву </button>
                      </div>
                  </div>
                  : null
          }
        <div  style={{
          display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start",
          width: '100%',
          marginTop: 20,
          marginLeft: 100,
          // backgroundColor: 'orange',
        }}>
          {Object.entries(this.state.payers).sort(function (a, b) {
              console.log(a[0], b[0]);
              if (a[0] > b[0]) {
                  return 1;
              }
              if (a[0] < b[0]) {
                  return -1;
              }

              return 0;
          }).map(entrie => {
            let total = 0;
            let payerId = entrie[0];
            let payer = entrie[1];

            return <div key={payerId} style={{
              display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start",
              marginBottom: 20,
            }}>
              <div style={{marginBottom: 10}}>{payerId}</div>
              {payer.sort(function (a, b) {
                  let aSplitDate = a.date.split("/");
                  let bSplitDate = b.date.split("/");

                  let aDate = new Date(aSplitDate[2], aSplitDate[1], aSplitDate[0]).getTime();
                  let bDate = new Date(bSplitDate[2], bSplitDate[1], bSplitDate[0]).getTime();

                  if (aDate > bDate) {
                      return 1;
                  }
                  if (aDate < bDate) {
                      return -1;
                  }

                  return 0;
              }).map(payment => {
                total += parseInt(payment.payment);

                return (<div key={payment.id} style={{
                  display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                }}>
                  <div style={{marginLeft: 10}}>{payment.date}</div>
                  <div style={{marginLeft: 10}}>{payment.payment}</div>
                </div>)
              })}
              <div style={{
                display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
                borderTop: '1px solid black',
              }}>
                <div style={{marginLeft: 10}}>Всього:</div>
                <div style={{marginLeft: 10}}>{total.toFixed(2)}</div>
              </div>
            </div>

          })}
        </div>
      </div>
    )
  }
}

export default Payers
