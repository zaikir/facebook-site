import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  FormHandlerContext, PageContext, SignupContext, SiteContext,
} from '../../../contexts';
import { PageRenderer } from '../../../services';

export default function FacebookSignup({ type }) {
  const page = useContext(PageContext);
  const { site: { language } } = useContext(SiteContext);
  const [user] = useContext(SignupContext);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const banner = page.modules.find((x) => x.moduleType === 'facebook-registration-banner');
  const text = page.modules.find((x) => x.moduleType === 'facebook-signup-text');
  const successText = page.modules.find((x) => x.moduleType === 'facebook-signup-success');
  const form = page.modules.find((x) => x.moduleType === 'facebook-signup-form');

  if (!banner) {
    return;
  }

  const onSubmit = async ({ siteId, ...item }) => {
    await axios.post('/api/auth/signup', {
      name: item.name,
      lastName: item.lastName,
      country: item.country,
      department: item.department,
      position: item.position,
      avatarId: item.avatarId,
      password: item.password,
      email: user.email,
      siteId,
      languageId: language.id,
    });

    setIsSubmitted(true);
  };

  const withVariables = (item) => (item ? ({
    ...item,
    moduleVariables: {
      ...item.moduleVariables,
      text: item.moduleVariables.text.replace('[EMAIL]', user?.email),
    },
  }) : null);

  const modules = [
    banner,
    !isSubmitted ? withVariables(text) : withVariables(successText),
    !isSubmitted && form,
  ].filter((x) => !!x);

  const pageRenderer = new PageRenderer({ modules, inline: true });

  return (
    <FormHandlerContext.Provider value={{ submit: onSubmit }}>
      {pageRenderer.render()}
    </FormHandlerContext.Provider>
  );
}