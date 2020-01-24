<?php

class billboardForgotpasswordAction extends waForgotPasswordAction
{
    public function execute()
    {
        $this->setLayout(new billboardFrontendLayout());

        $this->setThemeTemplate('forgotpassword.html');

        parent::execute();
    }
}
