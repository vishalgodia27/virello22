import React from 'react';
import { Button } from '../ui/button';
function Header() {
    return (
        <div className="p-2 shadow-sm flex justify-between items-center px-5 ">
            <img src="src/assets/logo.svg" alt="Logo"  height="175px" width="200px" className="h-10" margin-top="0px " />
            <div>
               <Button >
                sign in
               </Button>
            </div>
        </div>
    );
}

export default Header;
