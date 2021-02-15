import React from 'react';
import { I18n } from '@aws-amplify/core';
import { Authenticator } from 'aws-amplify-react';
import '@aws-amplify/ui/dist/style.css';
import authenticatorConfig from './config/authenticatorConfig';
import Payers from './Payers';
import Admin from './Admin';

const authScreenLabels = {
  en: {
    'Sign in to your account': 'Добро пожаловать!',
    'Username': 'Имя пользователя (email)',
    'Enter your username': 'Введите имя пользователя (email)',
    'Password': 'Пароль',
    'Enter your password': 'Введите пароль',
    'Reset password': 'Изменить пароль',
    'Forgot your password? ': 'Забыли пароль? ',
    'No account? ': 'Нет аккаунта? ',
    'Create account': 'Создать аккаунт',
    'Sign In': 'Войти',
    'Sign Out': 'Выйти',
    'Back to Sign In': 'Вернуться к началу',
    'Reset your password': 'Сбросить пароль',
    'Send Code': 'Отправить пин-код',
    'Have an account': 'Уже есть аккаунт?',
    'Phone Number': 'Номер телефона',
  }
};

I18n.setLanguage('en');
I18n.putVocabularies(authScreenLabels);

const MyTheme = {
  navItem: { display: 'none' },
  sectionFooterSecondaryContent: { 'display': 'none' },
};

const _Main = () => (
      <Authenticator theme={MyTheme} amplifyConfig={authenticatorConfig}>
        <Payers />
      </Authenticator>
);

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLogin: false,
    };
  }

  render() {
    console.log(this.props);
        return this.state.isLogin
          ? <Authenticator theme={MyTheme} amplifyConfig={authenticatorConfig}>
              <Admin />
            </Authenticator>
            : <div><button onClick={() => this.setState({isLogin: true})} >Login</button><Payers /></div>
  }
}

export default Main;
