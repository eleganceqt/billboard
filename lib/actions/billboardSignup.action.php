<?php

class billboardSignupAction extends waSignupAction
{
    public function execute()
    {
        $this->setLayout(new billboardFrontendLayout());

        $this->setThemeTemplate('signup.html');

        try {
            parent::execute();
        } catch (waException $e) {
            if ($e->getCode() == 404) {
                $this->view->assign('error_code', $e->getCode());
                $this->view->assign('error_message', $e->getMessage());
                $this->setThemeTemplate('error.html');
            } else {
                throw $e;
            }
        }

        wa()->getResponse()->setTitle(_w('Sign up'));
    }

    public function afterSignup(waContact $contact)
    {
        $contact->addToCategory($this->getAppId());
    }
}
