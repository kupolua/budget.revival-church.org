import React from 'react';
import axios from 'axios';

class Payers extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      payers: [],
      payment: '',
      userId: ''
    };
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

  render() {
    if(this.state.payers.length === 0) return <div>Loading...</div>
    // if(this.props.authState === 'signedIn' && this.props.authData) console.log('attributes', this.props.authData.attributes.sub);

    return (
      <div style={{
        display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center",
      }}>
          <div>KPL Бюджет завершення будівництва церкви 1 000 000 грн. Пожертвування: {this.state.sumPayments} грн. Виконано: {(this.state.sumPayments / 1000000 * 100).toFixed(2)}%</div>

        <div style={{
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
