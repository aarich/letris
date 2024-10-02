import { Fragment } from 'react';
import TextWall from '../../components/app/TextWall';
import { a } from '../../components/base/Anchor';
import { h4, p } from '../../components/base/io/Text';
import { MyConstants } from '../../utils';

const PRIVACY_URL = 'mrarich.com/privacy';

const elements = [
  h4('Privacy Policy'),
  p(
    'You can find the full privacy policy for this app ',
    a(PRIVACY_URL, 'here'),
    '.'
  ),
  h4('Acknowledgements'),
  p(
    'Thanks to the following open source software and free services for making this project possible.'
  ),
  [
    { name: 'Expo', url: 'expo.dev' },
    { name: 'React Native', url: 'reactnative.dev' },
    { name: 'React Native Skia', url: 'shopify.github.io/react-native-skia/' },
    { name: 'Redux', url: 'redux.js.org/' },
    { name: 'UI Kitten', url: 'akveo.github.io/react-native-ui-kitten' },
  ].map((link) => (
    <Fragment key={link.name}>{p(a(link.url, link.name))}</Fragment>
  )),
  p(
    a(
      `${MyConstants.githubUrl}/blob/master/package.json`,
      'And many more... ',
      { showIcon: true }
    )
  ),
  h4("Who's building this?"),
  p(
    'You can find out more about the developer ',
    a('mrarich.com/about', 'here'),
    '.'
  ),
  p(),
  p(
    `Want to see your name here? ${MyConstants.expoConfig?.name} is open source! `,
    a(MyConstants.githubUrl, 'Check it out on GitHub'),
    ' and, if you like, make an improvement.'
  ),
  p(),
  p(
    `Version ${MyConstants.version} © ${new Date(
      Date.now()
    ).getFullYear()} Alex Rich`
  ),
];

const AboutContainer = () => {
  return <TextWall elements={elements} />;
};

export default AboutContainer;
