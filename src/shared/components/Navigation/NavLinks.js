import CartContext from '../../../store/cart-context';
import LoggedInContext from '../../../store/loggedIn-context';

import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingCartOutlined } from '@ant-design/icons';


import './NavLinks.css';

const NavLinks = props => {
    const cart = useContext(CartContext);
    const loggedInCtx = useContext(LoggedInContext);
    const logoutHandler = () => {
        console.log(props.isAdmin);
        loggedInCtx.changeToLoggedOut();
        props.onLogout();
    }

    return <ul className="nav-links">
        <li>
            {loggedInCtx.isLoggedIn && <NavLink onClick={logoutHandler} to="/auth" >התנתקות</NavLink>}
        </li>
        {loggedInCtx.isLoggedIn && !props.isAdmin && <li>
            <NavLink to="/about">אודות</NavLink>
        </li>}
        {loggedInCtx.isLoggedIn && !props.isAdmin && <li>
            <NavLink id="cartLink" to="/cart">  <ShoppingCartOutlined /> {cart.items.reduce((a, b) => a = a + b.amount, 0)} עגלה    </NavLink>
        </li>}
        {loggedInCtx.isLoggedIn && !props.isAdmin && <li>
            <NavLink to="/u1/orders">ההזמנות שלי</NavLink>
        </li>}
        {loggedInCtx.isLoggedIn && !props.isAdmin && <li>
            <NavLink to="/myProfile">איזור אישי</NavLink>
        </li>}
        <li>
            {loggedInCtx.isLoggedIn && props.isAdmin && <NavLink to="/OrderManagement">ניהול הזמנות</NavLink>}
        </li>
        {loggedInCtx.isLoggedIn && <li>
            <NavLink to="/meals">תפריט</NavLink>
        </li>}
        <li>
            {!loggedInCtx.isLoggedIn && <NavLink to="/auth">הרשמה והתחברות</NavLink>}
        </li>

    </ul>
};

export default NavLinks;