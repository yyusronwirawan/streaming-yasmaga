import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '../../store';
import { useState, useEffect } from 'react';

const Sidebar = () => {
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const [errorSubMenu, setErrorSubMenu] = useState(false);
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const location = useLocation();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const pathParts = url.pathname.split('/')

    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="bg-white dark:bg-black h-full">
                    <div className="flex justify-between items-center px-4 py-3">
                        <NavLink to="/admin" className="main-logo flex items-center justify-center flex-grow">
                            {/*<img className="w-8 ml-[5px] flex-none" src="/assets/images/content.webp" alt="logo" />*/}
                            <img style={{ width: '8rem', margin: '0 auto' }} src="/assets/images/yasmaga_1.png" alt="logo" />
                            {/*<span className="text-2xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle lg:inline dark:text-white-light">{('YASMAGA.FM')}</span>*/}
                        </NavLink>

                        <button
                            type="button"
                            className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 m-auto">
                                <path d="M13 19L7 12L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                      strokeLinejoin="round"/>
                                <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor"
                                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>

                    <PerfectScrollbar className="h-[calc(100vh-80px)] relative">

                        <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                            <li className="menu nav-item">
                                <button type="button"
                                        className={`${pathParts.length === 2 ? 'active' : ''} nav-link group w-full`}
                                        onClick={() => navigate('/admin')}>
                                    <div className="flex items-center">
                                        <svg className="group-hover:!text-primary shrink-0" width="20" height="20"
                                             viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                opacity="0.5"
                                                d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z"
                                                fill="currentColor"
                                            />
                                            <path
                                                d="M9 17.25C8.58579 17.25 8.25 17.5858 8.25 18C8.25 18.4142 8.58579 18.75 9 18.75H15C15.4142 18.75 15.75 18.4142 15.75 18C15.75 17.5858 15.4142 17.25 15 17.25H9Z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                        <span
                                            className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark mt-1">Dashboard</span>
                                    </div>

                                    {/*<div className={currentMenu === 'dashboard' ? 'rotate-90' : 'rtl:rotate-180'}>*/}
                                    {/*    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                                    {/*        <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />*/}
                                    {/*    </svg>*/}
                                    {/*</div>*/}

                                </button>
                            </li>

                            <h2 className="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
                                <svg className="w-4 h-5 flex-none hidden" viewBox="0 0 24 24" stroke="currentColor"
                                     strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                <span>{t('APPS')}</span>
                            </h2>

                            {/*<h2 className="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">*/}
                            {/*    <svg className="w-4 h-5 flex-none hidden" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">*/}
                            {/*        <line x1="5" y1="12" x2="19" y2="12"></line>*/}
                            {/*    </svg>*/}
                            {/*    <span>{t('apps')}</span>*/}
                            {/*</h2>*/}

                            {/*<li className="nav-item">*/}
                            {/*    <ul>*/}
                            {/*        <li className="nav-item">*/}
                            {/*            <NavLink to="/apps/chat" className="group">*/}
                            {/*                <div className="flex items-center">*/}
                            {/*                    <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                            {/*                        <path*/}
                            {/*                            fillRule="evenodd"*/}
                            {/*                            clipRule="evenodd"*/}
                            {/*                            d="M10.4036 22.4797L10.6787 22.015C11.1195 21.2703 11.3399 20.8979 11.691 20.6902C12.0422 20.4825 12.5001 20.4678 13.4161 20.4385C14.275 20.4111 14.8523 20.3361 15.3458 20.1317C16.385 19.7012 17.2106 18.8756 17.641 17.8365C17.9639 17.0571 17.9639 16.0691 17.9639 14.093V13.2448C17.9639 10.4683 17.9639 9.08006 17.3389 8.06023C16.9892 7.48958 16.5094 7.0098 15.9388 6.66011C14.919 6.03516 13.5307 6.03516 10.7542 6.03516H8.20964C5.43314 6.03516 4.04489 6.03516 3.02507 6.66011C2.45442 7.0098 1.97464 7.48958 1.62495 8.06023C1 9.08006 1 10.4683 1 13.2448V14.093C1 16.0691 1 17.0571 1.32282 17.8365C1.75326 18.8756 2.57886 19.7012 3.61802 20.1317C4.11158 20.3361 4.68882 20.4111 5.5477 20.4385C6.46368 20.4678 6.92167 20.4825 7.27278 20.6902C7.6239 20.8979 7.84431 21.2703 8.28514 22.015L8.5602 22.4797C8.97002 23.1721 9.9938 23.1721 10.4036 22.4797ZM13.1928 14.5171C13.7783 14.5171 14.253 14.0424 14.253 13.4568C14.253 12.8713 13.7783 12.3966 13.1928 12.3966C12.6072 12.3966 12.1325 12.8713 12.1325 13.4568C12.1325 14.0424 12.6072 14.5171 13.1928 14.5171ZM10.5422 13.4568C10.5422 14.0424 10.0675 14.5171 9.48193 14.5171C8.89637 14.5171 8.42169 14.0424 8.42169 13.4568C8.42169 12.8713 8.89637 12.3966 9.48193 12.3966C10.0675 12.3966 10.5422 12.8713 10.5422 13.4568ZM5.77108 14.5171C6.35664 14.5171 6.83133 14.0424 6.83133 13.4568C6.83133 12.8713 6.35664 12.3966 5.77108 12.3966C5.18553 12.3966 4.71084 12.8713 4.71084 13.4568C4.71084 14.0424 5.18553 14.5171 5.77108 14.5171Z"*/}
                            {/*                            fill="currentColor"*/}
                            {/*                        />*/}
                            {/*                        <path*/}
                            {/*                            opacity="0.5"*/}
                            {/*                            d="M15.486 1C16.7529 0.999992 17.7603 0.999986 18.5683 1.07681C19.3967 1.15558 20.0972 1.32069 20.7212 1.70307C21.3632 2.09648 21.9029 2.63623 22.2963 3.27821C22.6787 3.90219 22.8438 4.60265 22.9226 5.43112C22.9994 6.23907 22.9994 7.24658 22.9994 8.51343V9.37869C22.9994 10.2803 22.9994 10.9975 22.9597 11.579C22.9191 12.174 22.8344 12.6848 22.6362 13.1632C22.152 14.3323 21.2232 15.2611 20.0541 15.7453C20.0249 15.7574 19.9955 15.7691 19.966 15.7804C19.8249 15.8343 19.7039 15.8806 19.5978 15.915H17.9477C17.9639 15.416 17.9639 14.8217 17.9639 14.093V13.2448C17.9639 10.4683 17.9639 9.08006 17.3389 8.06023C16.9892 7.48958 16.5094 7.0098 15.9388 6.66011C14.919 6.03516 13.5307 6.03516 10.7542 6.03516H8.20964C7.22423 6.03516 6.41369 6.03516 5.73242 6.06309V4.4127C5.76513 4.29934 5.80995 4.16941 5.86255 4.0169C5.95202 3.75751 6.06509 3.51219 6.20848 3.27821C6.60188 2.63623 7.14163 2.09648 7.78361 1.70307C8.40759 1.32069 9.10805 1.15558 9.93651 1.07681C10.7445 0.999986 11.7519 0.999992 13.0188 1H15.486Z"*/}
                            {/*                            fill="currentColor"*/}
                            {/*                        />*/}
                            {/*                    </svg>*/}
                            {/*                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('chat')}</span>*/}
                            {/*                </div>*/}
                            {/*            </NavLink>*/}
                            {/*        </li>*/}
                            {/*        <li className="nav-item">*/}
                            {/*            <NavLink to="/apps/mailbox" className="group">*/}
                            {/*                <div className="flex items-center">*/}
                            {/*                    <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                            {/*                        <path d="M24 5C24 6.65685 22.6569 8 21 8C19.3431 8 18 6.65685 18 5C18 3.34315 19.3431 2 21 2C22.6569 2 24 3.34315 24 5Z" fill="currentColor" />*/}
                            {/*                        <path*/}
                            {/*                            d="M17.2339 7.46394L15.6973 8.74444C14.671 9.59966 13.9585 10.1915 13.357 10.5784C12.7747 10.9529 12.3798 11.0786 12.0002 11.0786C11.6206 11.0786 11.2258 10.9529 10.6435 10.5784C10.0419 10.1915 9.32941 9.59966 8.30315 8.74444L5.92837 6.76546C5.57834 6.47377 5.05812 6.52106 4.76643 6.87109C4.47474 7.22112 4.52204 7.74133 4.87206 8.03302L7.28821 10.0465C8.2632 10.859 9.05344 11.5176 9.75091 11.9661C10.4775 12.4334 11.185 12.7286 12.0002 12.7286C12.8154 12.7286 13.523 12.4334 14.2495 11.9661C14.947 11.5176 15.7372 10.859 16.7122 10.0465L18.3785 8.65795C17.9274 8.33414 17.5388 7.92898 17.2339 7.46394Z"*/}
                            {/*                            fill="currentColor"*/}
                            {/*                        />*/}
                            {/*                        <path*/}
                            {/*                            d="M18.4538 6.58719C18.7362 6.53653 19.0372 6.63487 19.234 6.87109C19.3965 7.06614 19.4538 7.31403 19.4121 7.54579C19.0244 7.30344 18.696 6.97499 18.4538 6.58719Z"*/}
                            {/*                            fill="currentColor"*/}
                            {/*                        />*/}
                            {/*                        <path*/}
                            {/*                            opacity="0.5"*/}
                            {/*                            d="M16.9576 3.02099C16.156 3 15.2437 3 14.2 3H9.8C5.65164 3 3.57746 3 2.28873 4.31802C1 5.63604 1 7.75736 1 12C1 16.2426 1 18.364 2.28873 19.682C3.57746 21 5.65164 21 9.8 21H14.2C18.3484 21 20.4225 21 21.7113 19.682C23 18.364 23 16.2426 23 12C23 10.9326 23 9.99953 22.9795 9.1797C22.3821 9.47943 21.7103 9.64773 21 9.64773C18.5147 9.64773 16.5 7.58722 16.5 5.04545C16.5 4.31904 16.6646 3.63193 16.9576 3.02099Z"*/}
                            {/*                            fill="currentColor"*/}
                            {/*                        />*/}
                            {/*                    </svg>*/}
                            {/*                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('mailbox')}</span>*/}
                            {/*                </div>*/}
                            {/*            </NavLink>*/}
                            {/*        </li>*/}
                            {/*        <li className="nav-item">*/}
                            {/*            <NavLink to="/apps/todolist" className="group">*/}
                            {/*                <div className="flex items-center">*/}
                            {/*                    <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                            {/*                        <path*/}
                            {/*                            opacity="0.5"*/}
                            {/*                            d="M3 10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H13C16.7712 2 18.6569 2 19.8284 3.17157C21 4.34315 21 6.22876 21 10V14C21 17.7712 21 19.6569 19.8284 20.8284C18.6569 22 16.7712 22 13 22H11C7.22876 22 5.34315 22 4.17157 20.8284C3 19.6569 3 17.7712 3 14V10Z"*/}
                            {/*                            fill="currentColor"*/}
                            {/*                        />*/}
                            {/*                        <path*/}
                            {/*                            fillRule="evenodd"*/}
                            {/*                            clipRule="evenodd"*/}
                            {/*                            d="M12 5.25C12.4142 5.25 12.75 5.58579 12.75 6V7.25H14C14.4142 7.25 14.75 7.58579 14.75 8C14.75 8.41421 14.4142 8.75 14 8.75L12.75 8.75L12.75 10C12.75 10.4142 12.4142 10.75 12 10.75C11.5858 10.75 11.25 10.4142 11.25 10L11.25 8.75H9.99997C9.58575 8.75 9.24997 8.41421 9.24997 8C9.24997 7.58579 9.58575 7.25 9.99997 7.25H11.25L11.25 6C11.25 5.58579 11.5858 5.25 12 5.25ZM7.25 14C7.25 13.5858 7.58579 13.25 8 13.25H16C16.4142 13.25 16.75 13.5858 16.75 14C16.75 14.4142 16.4142 14.75 16 14.75H8C7.58579 14.75 7.25 14.4142 7.25 14ZM8.25 18C8.25 17.5858 8.58579 17.25 9 17.25H15C15.4142 17.25 15.75 17.5858 15.75 18C15.75 18.4142 15.4142 18.75 15 18.75H9C8.58579 18.75 8.25 18.4142 8.25 18Z"*/}
                            {/*                            fill="currentColor"*/}
                            {/*                        />*/}
                            {/*                    </svg>*/}
                            {/*                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('todo_list')}</span>*/}
                            {/*                </div>*/}
                            {/*            </NavLink>*/}
                            {/*        </li>*/}
                            {/*        <li className="nav-item">*/}
                            {/*            <NavLink to="/apps/notes" className="group">*/}
                            {/*                <div className="flex items-center">*/}
                            {/*                    <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                            {/*                        <path*/}
                            {/*                            opacity="0.5"*/}
                            {/*                            d="M3 10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H13C16.7712 2 18.6569 2 19.8284 3.17157C21 4.34315 21 6.22876 21 10V14C21 17.7712 21 19.6569 19.8284 20.8284C18.6569 22 16.7712 22 13 22H11C7.22876 22 5.34315 22 4.17157 20.8284C3 19.6569 3 17.7712 3 14V10Z"*/}
                            {/*                            fill="currentColor"*/}
                            {/*                        />*/}
                            {/*                        <path*/}
                            {/*                            fillRule="evenodd"*/}
                            {/*                            clipRule="evenodd"*/}
                            {/*                            d="M7.25 12C7.25 11.5858 7.58579 11.25 8 11.25H16C16.4142 11.25 16.75 11.5858 16.75 12C16.75 12.4142 16.4142 12.75 16 12.75H8C7.58579 12.75 7.25 12.4142 7.25 12Z"*/}
                            {/*                            fill="currentColor"*/}
                            {/*                        />*/}
                            {/*                        <path*/}
                            {/*                            fillRule="evenodd"*/}
                            {/*                            clipRule="evenodd"*/}
                            {/*                            d="M7.25 8C7.25 7.58579 7.58579 7.25 8 7.25H16C16.4142 7.25 16.75 7.58579 16.75 8C16.75 8.41421 16.4142 8.75 16 8.75H8C7.58579 8.75 7.25 8.41421 7.25 8Z"*/}
                            {/*                            fill="currentColor"*/}
                            {/*                        />*/}
                            {/*                        <path*/}
                            {/*                            fillRule="evenodd"*/}
                            {/*                            clipRule="evenodd"*/}
                            {/*                            d="M7.25 16C7.25 15.5858 7.58579 15.25 8 15.25H13C13.4142 15.25 13.75 15.5858 13.75 16C13.75 16.4142 13.4142 16.75 13 16.75H8C7.58579 16.75 7.25 16.4142 7.25 16Z"*/}
                            {/*                            fill="currentColor"*/}
                            {/*                        />*/}
                            {/*                    </svg>*/}
                            {/*                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('notes')}</span>*/}
                            {/*                </div>*/}
                            {/*            </NavLink>*/}
                            {/*        </li>*/}
                            {/*        <li className="nav-item">*/}
                            {/*            <NavLink to="/apps/scrumboard" className="group">*/}
                            {/*                <div className="flex items-center">*/}
                            {/*                    <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                            {/*                        <path*/}
                            {/*                            opacity="0.5"*/}
                            {/*                            d="M21 15.9983V9.99826C21 7.16983 21 5.75562 20.1213 4.87694C19.3529 4.10856 18.175 4.01211 16 4H8C5.82497 4.01211 4.64706 4.10856 3.87868 4.87694C3 5.75562 3 7.16983 3 9.99826V15.9983C3 18.8267 3 20.2409 3.87868 21.1196C4.75736 21.9983 6.17157 21.9983 9 21.9983H15C17.8284 21.9983 19.2426 21.9983 20.1213 21.1196C21 20.2409 21 18.8267 21 15.9983Z"*/}
                            {/*                            fill="currentColor"*/}
                            {/*                        />*/}
                            {/*                        <path*/}
                            {/*                            d="M8 3.5C8 2.67157 8.67157 2 9.5 2H14.5C15.3284 2 16 2.67157 16 3.5V4.5C16 5.32843 15.3284 6 14.5 6H9.5C8.67157 6 8 5.32843 8 4.5V3.5Z"*/}
                            {/*                            fill="currentColor"*/}
                            {/*                        />*/}
                            {/*                        <path*/}
                            {/*                            fillRule="evenodd"*/}
                            {/*                            clipRule="evenodd"*/}
                            {/*                            d="M12 9.25C12.4142 9.25 12.75 9.58579 12.75 10V12.25L15 12.25C15.4142 12.25 15.75 12.5858 15.75 13C15.75 13.4142 15.4142 13.75 15 13.75L12.75 13.75L12.75 16C12.75 16.4142 12.4142 16.75 12 16.75C11.5858 16.75 11.25 16.4142 11.25 16L11.25 13.75H9C8.58579 13.75 8.25 13.4142 8.25 13C8.25 12.5858 8.58579 12.25 9 12.25L11.25 12.25L11.25 10C11.25 9.58579 11.5858 9.25 12 9.25Z"*/}
                            {/*                            fill="currentColor"*/}
                            {/*                        />*/}
                            {/*                    </svg>*/}
                            {/*                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('scrumboard')}</span>*/}
                            {/*                </div>*/}
                            {/*            </NavLink>*/}
                            {/*        </li>*/}
                            {/*        <li className="nav-item">*/}
                            {/*            <NavLink to="/apps/contacts" className="group">*/}
                            {/*                <div className="flex items-center">*/}
                            {/*                    <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                            {/*                        <path*/}
                            {/*                            opacity="0.5"*/}
                            {/*                            d="M19.7165 20.3624C21.143 19.5846 22 18.5873 22 17.5C22 16.3475 21.0372 15.2961 19.4537 14.5C17.6226 13.5794 14.9617 13 12 13C9.03833 13 6.37738 13.5794 4.54631 14.5C2.96285 15.2961 2 16.3475 2 17.5C2 18.6525 2.96285 19.7039 4.54631 20.5C6.37738 21.4206 9.03833 22 12 22C15.1066 22 17.8823 21.3625 19.7165 20.3624Z"*/}
                            {/*                            fill="currentColor"*/}
                            {/*                        />*/}
                            {/*                        <path*/}
                            {/*                            fillRule="evenodd"*/}
                            {/*                            clipRule="evenodd"*/}
                            {/*                            d="M5 8.51464C5 4.9167 8.13401 2 12 2C15.866 2 19 4.9167 19 8.51464C19 12.0844 16.7658 16.2499 13.2801 17.7396C12.4675 18.0868 11.5325 18.0868 10.7199 17.7396C7.23416 16.2499 5 12.0844 5 8.51464ZM12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z"*/}
                            {/*                            fill="currentColor"*/}
                            {/*                        />*/}
                            {/*                    </svg>*/}
                            {/*                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('contacts')}</span>*/}
                            {/*                </div>*/}
                            {/*            </NavLink>*/}
                            {/*        </li>*/}


                            {/*        <li className="nav-item">*/}
                            {/*            <NavLink to="/apps/calendar" className="group">*/}
                            {/*                <div className="flex items-center">*/}
                            {/*                    <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                            {/*                        <path*/}
                            {/*                            d="M6.94028 2C7.35614 2 7.69326 2.32421 7.69326 2.72414V4.18487C8.36117 4.17241 9.10983 4.17241 9.95219 4.17241H13.9681C14.8104 4.17241 15.5591 4.17241 16.227 4.18487V2.72414C16.227 2.32421 16.5641 2 16.98 2C17.3958 2 17.733 2.32421 17.733 2.72414V4.24894C19.178 4.36022 20.1267 4.63333 20.8236 5.30359C21.5206 5.97385 21.8046 6.88616 21.9203 8.27586L22 9H2.92456H2V8.27586C2.11571 6.88616 2.3997 5.97385 3.09665 5.30359C3.79361 4.63333 4.74226 4.36022 6.1873 4.24894V2.72414C6.1873 2.32421 6.52442 2 6.94028 2Z"*/}
                            {/*                            fill="currentColor"*/}
                            {/*                        />*/}
                            {/*                        <path*/}
                            {/*                            opacity="0.5"*/}
                            {/*                            d="M21.9995 14.0001V12.0001C21.9995 11.161 21.9963 9.66527 21.9834 9H2.00917C1.99626 9.66527 1.99953 11.161 1.99953 12.0001V14.0001C1.99953 17.7713 1.99953 19.6569 3.1711 20.8285C4.34267 22.0001 6.22829 22.0001 9.99953 22.0001H13.9995C17.7708 22.0001 19.6564 22.0001 20.828 20.8285C21.9995 19.6569 21.9995 17.7713 21.9995 14.0001Z"*/}
                            {/*                            fill="currentColor"*/}
                            {/*                        />*/}
                            {/*                    </svg>*/}
                            {/*                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('calendar')}</span>*/}
                            {/*                </div>*/}
                            {/*            </NavLink>*/}
                            {/*        </li>*/}
                            {/*    </ul>*/}
                            {/*</li>*/}

                            {/*<h2 className="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">*/}
                            {/*    <svg className="w-4 h-5 flex-none hidden" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">*/}
                            {/*        <line x1="5" y1="12" x2="19" y2="12"></line>*/}
                            {/*    </svg>*/}
                            {/*    <span>{t('user_interface')}</span>*/}
                            {/*</h2>*/}

                            {/*<li className="menu nav-item">*/}
                            {/*    <button type="button" className={`${currentMenu === 'element' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('element')}>*/}
                            {/*        <div className="flex items-center">*/}
                            {/*            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:!text-primary shrink-0">*/}
                            {/*                <path*/}
                            {/*                    fillRule="evenodd"*/}
                            {/*                    clipRule="evenodd"*/}
                            {/*                    d="M8.73167 5.77133L5.66953 9.91436C4.3848 11.6526 3.74244 12.5217 4.09639 13.205C4.10225 13.2164 4.10829 13.2276 4.1145 13.2387C4.48945 13.9117 5.59888 13.9117 7.81775 13.9117C9.05079 13.9117 9.6673 13.9117 10.054 14.2754L10.074 14.2946L13.946 9.72466L13.926 9.70541C13.5474 9.33386 13.5474 8.74151 13.5474 7.55682V7.24712C13.5474 3.96249 13.5474 2.32018 12.6241 2.03721C11.7007 1.75425 10.711 3.09327 8.73167 5.77133Z"*/}
                            {/*                    fill="currentColor"*/}
                            {/*                ></path>*/}
                            {/*                <path*/}
                            {/*                    opacity="0.5"*/}
                            {/*                    d="M10.4527 16.4432L10.4527 16.7528C10.4527 20.0374 10.4527 21.6798 11.376 21.9627C12.2994 22.2457 13.2891 20.9067 15.2685 18.2286L18.3306 14.0856C19.6154 12.3474 20.2577 11.4783 19.9038 10.7949C19.8979 10.7836 19.8919 10.7724 19.8857 10.7613C19.5107 10.0883 18.4013 10.0883 16.1824 10.0883C14.9494 10.0883 14.3329 10.0883 13.9462 9.72461L10.0742 14.2946C10.4528 14.6661 10.4527 15.2585 10.4527 16.4432Z"*/}
                            {/*                    fill="currentColor"*/}
                            {/*                ></path>*/}
                            {/*            </svg>*/}
                            {/*            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('elements')}</span>*/}
                            {/*        </div>*/}

                            {/*        <div className={currentMenu === 'element' ? 'rotate-90' : 'rtl:rotate-180'}>*/}
                            {/*            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                            {/*                <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />*/}
                            {/*            </svg>*/}
                            {/*        </div>*/}
                            {/*    </button>*/}

                            {/*    <AnimateHeight duration={300} height={currentMenu === 'element' ? 'auto' : 0}>*/}
                            {/*        <ul className="sub-menu text-gray-500">*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/elements/alerts">{t('alerts')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/elements/avatar">{t('avatar')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/elements/badges">{t('badges')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/elements/breadcrumbs">{t('breadcrumbs')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/elements/buttons">{t('buttons')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/elements/buttons-group">{t('button_groups')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/elements/color-library">{t('color_library')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/elements/dropdown">{t('dropdown')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/elements/infobox">{t('infobox')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/elements/jumbotron">{t('jumbotron')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/elements/loader">{t('loader')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/elements/pagination">{t('pagination')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/elements/popovers">{t('popovers')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/elements/progress-bar">{t('progress_bar')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/elements/search">{t('search')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/elements/tooltips">{t('tooltips')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/elements/treeview">{t('treeview')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/elements/typography">{t('typography')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*        </ul>*/}
                            {/*    </AnimateHeight>*/}
                            {/*</li>*/}

                            {/*<li className="menu nav-item">*/}
                            {/*    <NavLink to="/charts" className="group">*/}
                            {/*        <div className="flex items-center">*/}
                            {/*            <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                            {/*                <path*/}
                            {/*                    opacity="0.5"*/}
                            {/*                    d="M6.22209 4.60105C6.66665 4.304 7.13344 4.04636 7.6171 3.82976C8.98898 3.21539 9.67491 2.9082 10.5875 3.4994C11.5 4.09061 11.5 5.06041 11.5 7.00001V8.50001C11.5 10.3856 11.5 11.3284 12.0858 11.9142C12.6716 12.5 13.6144 12.5 15.5 12.5H17C18.9396 12.5 19.9094 12.5 20.5006 13.4125C21.0918 14.3251 20.7846 15.011 20.1702 16.3829C19.9536 16.8666 19.696 17.3334 19.399 17.7779C18.3551 19.3402 16.8714 20.5578 15.1355 21.2769C13.3996 21.9959 11.4895 22.184 9.64665 21.8175C7.80383 21.4509 6.11109 20.5461 4.78249 19.2175C3.45389 17.8889 2.5491 16.1962 2.18254 14.3534C1.81598 12.5105 2.00412 10.6004 2.72315 8.86451C3.44218 7.12861 4.65982 5.64492 6.22209 4.60105Z"*/}
                            {/*                    fill="currentColor"*/}
                            {/*                />*/}
                            {/*                <path*/}
                            {/*                    d="M21.446 7.06901C20.6342 5.00831 18.9917 3.36579 16.931 2.55398C15.3895 1.94669 14 3.34316 14 5.00002V9.00002C14 9.5523 14.4477 10 15 10H19C20.6569 10 22.0533 8.61055 21.446 7.06901Z"*/}
                            {/*                    fill="currentColor"*/}
                            {/*                />*/}
                            {/*            </svg>*/}
                            {/*            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('charts')}</span>*/}
                            {/*        </div>*/}
                            {/*    </NavLink>*/}
                            {/*</li>*/}

                            {/*<li className="menu nav-item">*/}
                            {/*    <NavLink to="/widgets" className="group">*/}
                            {/*        <div className="flex items-center">*/}
                            {/*            <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                            {/*                <path*/}
                            {/*                    opacity="0.5"*/}
                            {/*                    d="M13 15.4C13 13.3258 13 12.2887 13.659 11.6444C14.318 11 15.3787 11 17.5 11C19.6213 11 20.682 11 21.341 11.6444C22 12.2887 22 13.3258 22 15.4V17.6C22 19.6742 22 20.7113 21.341 21.3556C20.682 22 19.6213 22 17.5 22C15.3787 22 14.318 22 13.659 21.3556C13 20.7113 13 19.6742 13 17.6V15.4Z"*/}
                            {/*                    fill="currentColor"*/}
                            {/*                />*/}
                            {/*                <path*/}
                            {/*                    d="M2 8.6C2 10.6742 2 11.7113 2.65901 12.3556C3.31802 13 4.37868 13 6.5 13C8.62132 13 9.68198 13 10.341 12.3556C11 11.7113 11 10.6742 11 8.6V6.4C11 4.32582 11 3.28873 10.341 2.64437C9.68198 2 8.62132 2 6.5 2C4.37868 2 3.31802 2 2.65901 2.64437C2 3.28873 2 4.32582 2 6.4V8.6Z"*/}
                            {/*                    fill="currentColor"*/}
                            {/*                />*/}
                            {/*                <path*/}
                            {/*                    d="M13 5.5C13 4.4128 13 3.8692 13.1713 3.44041C13.3996 2.86867 13.8376 2.41443 14.389 2.17761C14.8024 2 15.3266 2 16.375 2H18.625C19.6734 2 20.1976 2 20.611 2.17761C21.1624 2.41443 21.6004 2.86867 21.8287 3.44041C22 3.8692 22 4.4128 22 5.5C22 6.5872 22 7.1308 21.8287 7.55959C21.6004 8.13133 21.1624 8.58557 20.611 8.82239C20.1976 9 19.6734 9 18.625 9H16.375C15.3266 9 14.8024 9 14.389 8.82239C13.8376 8.58557 13.3996 8.13133 13.1713 7.55959C13 7.1308 13 6.5872 13 5.5Z"*/}
                            {/*                    fill="currentColor"*/}
                            {/*                />*/}
                            {/*                <path*/}
                            {/*                    opacity="0.5"*/}
                            {/*                    d="M2 18.5C2 19.5872 2 20.1308 2.17127 20.5596C2.39963 21.1313 2.83765 21.5856 3.38896 21.8224C3.80245 22 4.32663 22 5.375 22H7.625C8.67337 22 9.19755 22 9.61104 21.8224C10.1624 21.5856 10.6004 21.1313 10.8287 20.5596C11 20.1308 11 19.5872 11 18.5C11 17.4128 11 16.8692 10.8287 16.4404C10.6004 15.8687 10.1624 15.4144 9.61104 15.1776C9.19755 15 8.67337 15 7.625 15H5.375C4.32663 15 3.80245 15 3.38896 15.1776C2.83765 15.4144 2.39963 15.8687 2.17127 16.4404C2 16.8692 2 17.4128 2 18.5Z"*/}
                            {/*                    fill="currentColor"*/}
                            {/*                />*/}
                            {/*            </svg>*/}
                            {/*            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('widgets')}</span>*/}
                            {/*        </div>*/}
                            {/*    </NavLink>*/}
                            {/*</li>*/}

                            {/*<li className="menu nav-item">*/}
                            {/*    <NavLink to="/font-icons" className="group">*/}
                            {/*        <div className="flex items-center">*/}
                            {/*            <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                            {/*                <path*/}
                            {/*                    opacity="0.5"*/}
                            {/*                    d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z"*/}
                            {/*                    fill="currentColor"*/}
                            {/*                />*/}
                            {/*                <path*/}
                            {/*                    fillRule="evenodd"*/}
                            {/*                    clipRule="evenodd"*/}
                            {/*                    d="M12 6.75C9.1005 6.75 6.75 9.1005 6.75 12C6.75 14.8995 9.1005 17.25 12 17.25C12.4142 17.25 12.75 17.5858 12.75 18C12.75 18.4142 12.4142 18.75 12 18.75C8.27208 18.75 5.25 15.7279 5.25 12C5.25 8.27208 8.27208 5.25 12 5.25C15.7279 5.25 18.75 8.27208 18.75 12C18.75 12.8103 18.6069 13.5889 18.3439 14.3108C18.211 14.6756 17.9855 14.9732 17.7354 15.204L17.6548 15.2783C16.8451 16.0252 15.6294 16.121 14.7127 15.5099C14.3431 15.2635 14.0557 14.9233 13.8735 14.5325C13.3499 14.9205 12.7017 15.15 12 15.15C10.2603 15.15 8.85 13.7397 8.85 12C8.85 10.2603 10.2603 8.85 12 8.85C13.7397 8.85 15.15 10.2603 15.15 12V13.5241C15.15 13.8206 15.2981 14.0974 15.5448 14.2618C15.8853 14.4888 16.3369 14.4533 16.6377 14.1758L16.7183 14.1015C16.8295 13.9989 16.8991 13.8944 16.9345 13.7973C17.1384 13.2376 17.25 12.6327 17.25 12C17.25 9.1005 14.8995 6.75 12 6.75ZM12 10.35C12.9113 10.35 13.65 11.0887 13.65 12C13.65 12.9113 12.9113 13.65 12 13.65C11.0887 13.65 10.35 12.9113 10.35 12C10.35 11.0887 11.0887 10.35 12 10.35Z"*/}
                            {/*                    fill="currentColor"*/}
                            {/*                />*/}
                            {/*            </svg>*/}
                            {/*            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('font_icons')}</span>*/}
                            {/*        </div>*/}
                            {/*    </NavLink>*/}
                            {/*</li>*/}

                            {/*<li className="menu nav-item">*/}
                            {/*    <NavLink to="/dragndrop" className="group">*/}
                            {/*        <div className="flex items-center">*/}
                            {/*            <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                            {/*                <path*/}
                            {/*                    opacity="0.5"*/}
                            {/*                    d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z"*/}
                            {/*                    fill="currentColor"*/}
                            {/*                />*/}
                            {/*                <path*/}
                            {/*                    d="M13.25 7C13.25 7.41421 13.5858 7.75 14 7.75H15.1893L12.9697 9.96967C12.6768 10.2626 12.6768 10.7374 12.9697 11.0303C13.2626 11.3232 13.7374 11.3232 14.0303 11.0303L16.25 8.81066V10C16.25 10.4142 16.5858 10.75 17 10.75C17.4142 10.75 17.75 10.4142 17.75 10V7C17.75 6.58579 17.4142 6.25 17 6.25H14C13.5858 6.25 13.25 6.58579 13.25 7Z"*/}
                            {/*                    fill="currentColor"*/}
                            {/*                />*/}
                            {/*                <path*/}
                            {/*                    d="M11.0303 14.0303C11.3232 13.7374 11.3232 13.2626 11.0303 12.9697C10.7374 12.6768 10.2626 12.6768 9.96967 12.9697L7.75 15.1893V14C7.75 13.5858 7.41421 13.25 7 13.25C6.58579 13.25 6.25 13.5858 6.25 14V17C6.25 17.4142 6.58579 17.75 7 17.75H10C10.4142 17.75 10.75 17.4142 10.75 17C10.75 16.5858 10.4142 16.25 10 16.25H8.81066L11.0303 14.0303Z"*/}
                            {/*                    fill="currentColor"*/}
                            {/*                />*/}
                            {/*                <path*/}
                            {/*                    d="M10.75 7C10.75 7.41421 10.4142 7.75 10 7.75H8.81066L11.0303 9.96967C11.3232 10.2626 11.3232 10.7374 11.0303 11.0303C10.7374 11.3232 10.2626 11.3232 9.96967 11.0303L7.75 8.81066V10C7.75 10.4142 7.41421 10.75 7 10.75C6.58579 10.75 6.25 10.4142 6.25 10V7C6.25 6.58579 6.58579 6.25 7 6.25H10C10.4142 6.25 10.75 6.58579 10.75 7Z"*/}
                            {/*                    fill="currentColor"*/}
                            {/*                />*/}
                            {/*                <path*/}
                            {/*                    d="M12.9697 14.0303C12.6768 13.7374 12.6768 13.2626 12.9697 12.9697C13.2626 12.6768 13.7374 12.6768 14.0303 12.9697L16.25 15.1893V14C16.25 13.5858 16.5858 13.25 17 13.25C17.4142 13.25 17.75 13.5858 17.75 14V17C17.75 17.4142 17.4142 17.75 17 17.75H14C13.5858 17.75 13.25 17.4142 13.25 17C13.25 16.5858 13.5858 16.25 14 16.25H15.1893L12.9697 14.0303Z"*/}
                            {/*                    fill="currentColor"*/}
                            {/*                />*/}
                            {/*            </svg>*/}
                            {/*            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('drag_and_drop')}</span>*/}
                            {/*        </div>*/}
                            {/*    </NavLink>*/}
                            {/*</li>*/}

                            {/*<h2 className="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">*/}
                            {/*    <svg className="w-4 h-5 flex-none hidden" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">*/}
                            {/*        <line x1="5" y1="12" x2="19" y2="12"></line>*/}
                            {/*    </svg>*/}
                            {/*    <span>{t('tables_and_forms')}</span>*/}
                            {/*</h2>*/}

                            {/*<li className="menu nav-item">*/}
                            {/*    <NavLink to="/tables" className="group">*/}
                            {/*        <div className="flex items-center">*/}
                            {/*            <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                            {/*                <path*/}
                            {/*                    opacity="0.5"*/}
                            {/*                    d="M12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22Z"*/}
                            {/*                    fill="currentColor"*/}
                            {/*                />*/}
                            {/*                <path*/}
                            {/*                    d="M18.75 8C18.75 8.41421 18.4142 8.75 18 8.75H6C5.58579 8.75 5.25 8.41421 5.25 8C5.25 7.58579 5.58579 7.25 6 7.25H18C18.4142 7.25 18.75 7.58579 18.75 8Z"*/}
                            {/*                    fill="currentColor"*/}
                            {/*                />*/}
                            {/*                <path*/}
                            {/*                    d="M18.75 12C18.75 12.4142 18.4142 12.75 18 12.75H6C5.58579 12.75 5.25 12.4142 5.25 12C5.25 11.5858 5.58579 11.25 6 11.25H18C18.4142 11.25 18.75 11.5858 18.75 12Z"*/}
                            {/*                    fill="currentColor"*/}
                            {/*                />*/}
                            {/*                <path*/}
                            {/*                    d="M18.75 16C18.75 16.4142 18.4142 16.75 18 16.75H6C5.58579 16.75 5.25 16.4142 5.25 16C5.25 15.5858 5.58579 15.25 6 15.25H18C18.4142 15.25 18.75 15.5858 18.75 16Z"*/}
                            {/*                    fill="currentColor"*/}
                            {/*                />*/}
                            {/*            </svg>*/}
                            {/*            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('tables')}</span>*/}
                            {/*        </div>*/}
                            {/*    </NavLink>*/}
                            {/*</li>*/}

                            {/*<li className="menu nav-item">*/}
                            {/*    <button type="button" className={`${currentMenu === 'datalabel' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('datalabel')}>*/}
                            {/*        <div className="flex items-center">*/}
                            {/*            <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                            {/*                <path*/}
                            {/*                    d="M4.97883 9.68508C2.99294 8.89073 2 8.49355 2 8C2 7.50645 2.99294 7.10927 4.97883 6.31492L7.7873 5.19153C9.77318 4.39718 10.7661 4 12 4C13.2339 4 14.2268 4.39718 16.2127 5.19153L19.0212 6.31492C21.0071 7.10927 22 7.50645 22 8C22 8.49355 21.0071 8.89073 19.0212 9.68508L16.2127 10.8085C14.2268 11.6028 13.2339 12 12 12C10.7661 12 9.77318 11.6028 7.7873 10.8085L4.97883 9.68508Z"*/}
                            {/*                    fill="currentColor"*/}
                            {/*                />*/}
                            {/*                <path*/}
                            {/*                    fillRule="evenodd"*/}
                            {/*                    clipRule="evenodd"*/}
                            {/*                    d="M2 8C2 8.49355 2.99294 8.89073 4.97883 9.68508L7.7873 10.8085C9.77318 11.6028 10.7661 12 12 12C13.2339 12 14.2268 11.6028 16.2127 10.8085L19.0212 9.68508C21.0071 8.89073 22 8.49355 22 8C22 7.50645 21.0071 7.10927 19.0212 6.31492L16.2127 5.19153C14.2268 4.39718 13.2339 4 12 4C10.7661 4 9.77318 4.39718 7.7873 5.19153L4.97883 6.31492C2.99294 7.10927 2 7.50645 2 8Z"*/}
                            {/*                    fill="currentColor"*/}
                            {/*                />*/}
                            {/*                <path*/}
                            {/*                    opacity="0.7"*/}
                            {/*                    d="M5.76613 10L4.97883 10.3149C2.99294 11.1093 2 11.5065 2 12C2 12.4935 2.99294 12.8907 4.97883 13.6851L7.7873 14.8085C9.77318 15.6028 10.7661 16 12 16C13.2339 16 14.2268 15.6028 16.2127 14.8085L19.0212 13.6851C21.0071 12.8907 22 12.4935 22 12C22 11.5065 21.0071 11.1093 19.0212 10.3149L18.2339 10L16.2127 10.8085C14.2268 11.6028 13.2339 12 12 12C10.7661 12 9.77318 11.6028 7.7873 10.8085L5.76613 10Z"*/}
                            {/*                    fill="currentColor"*/}
                            {/*                />*/}
                            {/*                <path*/}
                            {/*                    opacity="0.4"*/}
                            {/*                    d="M5.76613 14L4.97883 14.3149C2.99294 15.1093 2 15.5065 2 16C2 16.4935 2.99294 16.8907 4.97883 17.6851L7.7873 18.8085C9.77318 19.6028 10.7661 20 12 20C13.2339 20 14.2268 19.6028 16.2127 18.8085L19.0212 17.6851C21.0071 16.8907 22 16.4935 22 16C22 15.5065 21.0071 15.1093 19.0212 14.3149L18.2339 14L16.2127 14.8085C14.2268 15.6028 13.2339 16 12 16C10.7661 16 9.77318 15.6028 7.7873 14.8085L5.76613 14Z"*/}
                            {/*                    fill="currentColor"*/}
                            {/*                />*/}
                            {/*            </svg>*/}
                            {/*            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('datatables')}</span>*/}
                            {/*        </div>*/}

                            {/*        <div className={currentMenu === 'datalabel' ? 'rotate-90' : 'rtl:rotate-180'}>*/}
                            {/*            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                            {/*                <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />*/}
                            {/*            </svg>*/}
                            {/*        </div>*/}
                            {/*    </button>*/}

                            {/*    <AnimateHeight duration={300} height={currentMenu === 'datalabel' ? 'auto' : 0}>*/}
                            {/*        <ul className="sub-menu text-gray-500">*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/datatables/basic">{t('basic')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/datatables/advanced">{t('advanced')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/datatables/skin">{t('skin')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/datatables/order-sorting">{t('order_sorting')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/datatables/multi-column">{t('multi_column')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/datatables/multiple-tables">{t('multiple_tables')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/datatables/alt-pagination">{t('alt_pagination')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/datatables/checkbox">{t('checkbox')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/datatables/range-search">{t('range_search')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/datatables/export">{t('export')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/datatables/column-chooser">{t('column_chooser')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*        </ul>*/}
                            {/*    </AnimateHeight>*/}
                            {/*</li>*/}

                            {/*<li className="menu nav-item">*/}
                            {/*    <button type="button" className={`${currentMenu === 'forms' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('forms')}>*/}
                            {/*        <div className="flex items-center">*/}
                            {/*            <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                            {/*                <path*/}
                            {/*                    opacity="0.5"*/}
                            {/*                    d="M3 10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H13C16.7712 2 18.6569 2 19.8284 3.17157C21 4.34315 21 6.22876 21 10V14C21 17.7712 21 19.6569 19.8284 20.8284C18.6569 22 16.7712 22 13 22H11C7.22876 22 5.34315 22 4.17157 20.8284C3 19.6569 3 17.7712 3 14V10Z"*/}
                            {/*                    fill="currentColor"*/}
                            {/*                />*/}
                            {/*                <path*/}
                            {/*                    d="M16.5189 16.5013C16.6939 16.3648 16.8526 16.2061 17.1701 15.8886L21.1275 11.9312C21.2231 11.8356 21.1793 11.6708 21.0515 11.6264C20.5844 11.4644 19.9767 11.1601 19.4083 10.5917C18.8399 10.0233 18.5356 9.41561 18.3736 8.94849C18.3292 8.82066 18.1644 8.77687 18.0688 8.87254L14.1114 12.8299C13.7939 13.1474 13.6352 13.3061 13.4987 13.4811C13.3377 13.6876 13.1996 13.9109 13.087 14.1473C12.9915 14.3476 12.9205 14.5606 12.7786 14.9865L12.5951 15.5368L12.3034 16.4118L12.0299 17.2323C11.9601 17.4419 12.0146 17.6729 12.1708 17.8292C12.3271 17.9854 12.5581 18.0399 12.7677 17.9701L13.5882 17.6966L14.4632 17.4049L15.0135 17.2214L15.0136 17.2214C15.4394 17.0795 15.6524 17.0085 15.8527 16.913C16.0891 16.8004 16.3124 16.6623 16.5189 16.5013Z"*/}
                            {/*                    fill="currentColor"*/}
                            {/*                />*/}
                            {/*                <path*/}
                            {/*                    d="M22.3665 10.6922C23.2112 9.84754 23.2112 8.47812 22.3665 7.63348C21.5219 6.78884 20.1525 6.78884 19.3078 7.63348L19.1806 7.76071C19.0578 7.88348 19.0022 8.05496 19.0329 8.22586C19.0522 8.33336 19.0879 8.49053 19.153 8.67807C19.2831 9.05314 19.5288 9.54549 19.9917 10.0083C20.4545 10.4712 20.9469 10.7169 21.3219 10.847C21.5095 10.9121 21.6666 10.9478 21.7741 10.9671C21.945 10.9978 22.1165 10.9422 22.2393 10.8194L22.3665 10.6922Z"*/}
                            {/*                    fill="currentColor"*/}
                            {/*                />*/}
                            {/*                <path*/}
                            {/*                    fillRule="evenodd"*/}
                            {/*                    clipRule="evenodd"*/}
                            {/*                    d="M7.25 9C7.25 8.58579 7.58579 8.25 8 8.25H14.5C14.9142 8.25 15.25 8.58579 15.25 9C15.25 9.41421 14.9142 9.75 14.5 9.75H8C7.58579 9.75 7.25 9.41421 7.25 9ZM7.25 13C7.25 12.5858 7.58579 12.25 8 12.25H11C11.4142 12.25 11.75 12.5858 11.75 13C11.75 13.4142 11.4142 13.75 11 13.75H8C7.58579 13.75 7.25 13.4142 7.25 13ZM7.25 17C7.25 16.5858 7.58579 16.25 8 16.25H9.5C9.91421 16.25 10.25 16.5858 10.25 17C10.25 17.4142 9.91421 17.75 9.5 17.75H8C7.58579 17.75 7.25 17.4142 7.25 17Z"*/}
                            {/*                    fill="currentColor"*/}
                            {/*                />*/}
                            {/*            </svg>*/}
                            {/*            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('forms')}</span>*/}
                            {/*        </div>*/}

                            {/*        <div className={currentMenu === 'forms' ? 'rotate-90' : 'rtl:rotate-180'}>*/}
                            {/*            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                            {/*                <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />*/}
                            {/*            </svg>*/}
                            {/*        </div>*/}
                            {/*    </button>*/}

                            {/*    <AnimateHeight duration={300} height={currentMenu === 'forms' ? 'auto' : 0}>*/}
                            {/*        <ul className="sub-menu text-gray-500">*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/forms/basic">{t('basic')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/forms/input-group">{t('input_group')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/forms/layouts">{t('layouts')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/forms/validation">{t('validation')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/forms/input-mask">{t('input_mask')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/forms/select2">{t('select2')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/forms/touchspin">{t('touchspin')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/forms/checkbox-radio">{t('checkbox_and_radio')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/forms/switches">{t('switches')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/forms/wizards">{t('wizards')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/forms/file-upload">{t('file_upload')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/forms/quill-editor">{t('quill_editor')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/forms/markdown-editor">{t('markdown_editor')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/forms/date-picker">{t('date_and_range_picker')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <NavLink to="/forms/clipboard">{t('clipboard')}</NavLink>*/}
                            {/*            </li>*/}
                            {/*        </ul>*/}
                            {/*    </AnimateHeight>*/}
                            {/*</li>*/}

                            {/*<h2 className="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">*/}
                            {/*    <svg className="w-4 h-5 flex-none hidden" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">*/}
                            {/*        <line x1="5" y1="12" x2="19" y2="12"></line>*/}
                            {/*    </svg>*/}
                            {/*    <span>{t('user_and_pages')}</span>*/}
                            {/*</h2>*/}

                            <li className="menu nav-item">
                                <button type="button"
                                        className={`${pathParts[pathParts.length - 1] === 'schedules' ? 'active' : ''} nav-link group w-full`}
                                        onClick={() => navigate('/admin/schedules')}>
                                    <div className="flex items-center">
                                    <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M6.94028 2C7.35614 2 7.69326 2.32421 7.69326 2.72414V4.18487C8.36117 4.17241 9.10983 4.17241 9.95219 4.17241H13.9681C14.8104 4.17241 15.5591 4.17241 16.227 4.18487V2.72414C16.227 2.32421 16.5641 2 16.98 2C17.3958 2 17.733 2.32421 17.733 2.72414V4.24894C19.178 4.36022 20.1267 4.63333 20.8236 5.30359C21.5206 5.97385 21.8046 6.88616 21.9203 8.27586L22 9H2.92456H2V8.27586C2.11571 6.88616 2.3997 5.97385 3.09665 5.30359C3.79361 4.63333 4.74226 4.36022 6.1873 4.24894V2.72414C6.1873 2.32421 6.52442 2 6.94028 2Z"
                                                        fill="currentColor"
                                                    />
                                                    <path
                                                        opacity="0.5"
                                                        d="M21.9995 14.0001V12.0001C21.9995 11.161 21.9963 9.66527 21.9834 9H2.00917C1.99626 9.66527 1.99953 11.161 1.99953 12.0001V14.0001C1.99953 17.7713 1.99953 19.6569 3.1711 20.8285C4.34267 22.0001 6.22829 22.0001 9.99953 22.0001H13.9995C17.7708 22.0001 19.6564 22.0001 20.828 20.8285C21.9995 19.6569 21.9995 17.7713 21.9995 14.0001Z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                        <span
                                            className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark mt-1">Data Jadwal</span>
                                        {/*<span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Jadwal Siaran')}</span>*/}
                                    </div>

                                    {/*<div className={currentMenu === 'page' ? 'rotate-90' : 'rtl:rotate-180'}>*/}
                                    {/*    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"*/}
                                    {/*         xmlns="http://www.w3.org/2000/svg">*/}
                                    {/*        <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5"*/}
                                    {/*              strokeLinecap="round" strokeLinejoin="round"/>*/}
                                    {/*    </svg>*/}
                                    {/*</div>*/}
                                </button>
                            </li>

                            <li className="menu nav-item">
                                <button type="button"
                                        className={`${pathParts[pathParts.length - 1] === 'promotions' ? 'active' : ''} nav-link group w-full`}
                                        onClick={() => navigate('/admin/promotions')}>
                                    <div className="flex items-center">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"><path opacity="0.5" d="M3 10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H13C16.7712 2 18.6569 2 19.8284 3.17157C21 4.34315 21 6.22876 21 10V14C21 17.7712 21 19.6569 19.8284 20.8284C18.6569 22 16.7712 22 13 22H11C7.22876 22 5.34315 22 4.17157 20.8284C3 19.6569 3 17.7712 3 14V10Z" fill="currentColor"></path><path d="M16.5189 16.5013C16.6939 16.3648 16.8526 16.2061 17.1701 15.8886L21.1275 11.9312C21.2231 11.8356 21.1793 11.6708 21.0515 11.6264C20.5844 11.4644 19.9767 11.1601 19.4083 10.5917C18.8399 10.0233 18.5356 9.41561 18.3736 8.94849C18.3292 8.82066 18.1644 8.77687 18.0688 8.87254L14.1114 12.8299C13.7939 13.1474 13.6352 13.3061 13.4987 13.4811C13.3377 13.6876 13.1996 13.9109 13.087 14.1473C12.9915 14.3476 12.9205 14.5606 12.7786 14.9865L12.5951 15.5368L12.3034 16.4118L12.0299 17.2323C11.9601 17.4419 12.0146 17.6729 12.1708 17.8292C12.3271 17.9854 12.5581 18.0399 12.7677 17.9701L13.5882 17.6966L14.4632 17.4049L15.0135 17.2214L15.0136 17.2214C15.4394 17.0795 15.6524 17.0085 15.8527 16.913C16.0891 16.8004 16.3124 16.6623 16.5189 16.5013Z" fill="currentColor"></path><path d="M22.3665 10.6922C23.2112 9.84754 23.2112 8.47812 22.3665 7.63348C21.5219 6.78884 20.1525 6.78884 19.3078 7.63348L19.1806 7.76071C19.0578 7.88348 19.0022 8.05496 19.0329 8.22586C19.0522 8.33336 19.0879 8.49053 19.153 8.67807C19.2831 9.05314 19.5288 9.54549 19.9917 10.0083C20.4545 10.4712 20.9469 10.7169 21.3219 10.847C21.5095 10.9121 21.6666 10.9478 21.7741 10.9671C21.945 10.9978 22.1165 10.9422 22.2393 10.8194L22.3665 10.6922Z" fill="currentColor"></path><path fillRule="evenodd" clipRule="evenodd" d="M7.25 9C7.25 8.58579 7.58579 8.25 8 8.25H14.5C14.9142 8.25 15.25 8.58579 15.25 9C15.25 9.41421 14.9142 9.75 14.5 9.75H8C7.58579 9.75 7.25 9.41421 7.25 9ZM7.25 13C7.25 12.5858 7.58579 12.25 8 12.25H11C11.4142 12.25 11.75 12.5858 11.75 13C11.75 13.4142 11.4142 13.75 11 13.75H8C7.58579 13.75 7.25 13.4142 7.25 13ZM7.25 17C7.25 16.5858 7.58579 16.25 8 16.25H9.5C9.91421 16.25 10.25 16.5858 10.25 17C10.25 17.4142 9.91421 17.75 9.5 17.75H8C7.58579 17.75 7.25 17.4142 7.25 17Z" fill="currentColor"></path></svg>
                                        <span
                                            className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Data Promosi')}</span>
                                    </div>

                                    {/*<div className={currentMenu === 'users' ? 'rotate-90' : 'rtl:rotate-180'}>*/}
                                    {/*    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                                    {/*        <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />*/}
                                    {/*    </svg>*/}
                                    {/*</div>*/}
                                </button>

                                {/*<AnimateHeight duration={300} height={currentMenu === 'component' ? 'auto' : 0}>*/}
                                {/*    <ul className="sub-menu text-gray-500">*/}
                                {/*        <li>*/}
                                {/*            <NavLink to="/admin/profile">{t('profile')}</NavLink>*/}
                                {/*        </li>*/}
                                {/*        <li>*/}
                                {/*            <NavLink to="/admin/users">{t('Setting Akun')}</NavLink>*/}
                                {/*        </li>*/}
                                {/*    </ul>*/}
                                {/*</AnimateHeight>*/}
                            </li>

                            <li className="menu nav-item">
                                <button type="button"
                                        className={`${pathParts[pathParts.length - 1] === 'users' ? 'active' : ''} nav-link group w-full`}
                                        onClick={() => navigate('/admin/users')}>
                                    <div className="flex items-center">
                                        <svg className="group-hover:!text-primary shrink-0" width="20" height="20"
                                             viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle opacity="0.5" cx="15" cy="6" r="3" fill="currentColor"/>
                                            <ellipse opacity="0.5" cx="16" cy="17" rx="5" ry="3" fill="currentColor"/>
                                            <circle cx="9.00098" cy="6" r="4" fill="currentColor"/>
                                            <ellipse cx="9.00098" cy="17.001" rx="7" ry="4" fill="currentColor"/>
                                        </svg>
                                        <span
                                            className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark mt-1">Data Pengguna</span>
                                    </div>

                                    {/*<div className={currentMenu === 'invoice' ? '!rotate-90' : 'rtl:rotate-180'}>*/}
                                    {/*    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"*/}
                                    {/*         xmlns="http://www.w3.org/2000/svg">*/}
                                    {/*        <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5"*/}
                                    {/*              strokeLinecap="round" strokeLinejoin="round"/>*/}
                                    {/*    </svg>*/}
                                    {/*</div>*/}
                                </button>
                            </li>


                            {/*<li className="menu nav-item">*/}
                            {/*    <button type="button"*/}
                            {/*            className={`${pathParts[pathParts.length - 1] === 'users' ? 'active' : ''} nav-link group w-full`}*/}
                            {/*            onClick={() => navigate('/admin/users')}>*/}
                            {/*        <div className="flex items-center">*/}
                            {/*            <svg className="group-hover:!text-primary shrink-0" width="20" height="20"*/}
                            {/*                 viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                            {/*                <circle opacity="0.5" cx="15" cy="6" r="3" fill="currentColor"/>*/}
                            {/*                <ellipse opacity="0.5" cx="16" cy="17" rx="5" ry="3" fill="currentColor"/>*/}
                            {/*                <circle cx="9.00098" cy="6" r="4" fill="currentColor"/>*/}
                            {/*                <ellipse cx="9.00098" cy="17.001" rx="7" ry="4" fill="currentColor"/>*/}
                            {/*            </svg>*/}
                            {/*            <span*/}
                            {/*                className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark mt-1">Data User</span>*/}
                            {/*            /!*<span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Data User')}</span>*!/*/}
                            {/*        </div>*/}

                            {/*        /!*<div className={currentMenu === 'users' ? 'rotate-90' : 'rtl:rotate-180'}>*!/*/}
                            {/*        /!*    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*!/*/}
                            {/*        /!*        <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />*!/*/}
                            {/*        /!*    </svg>*!/*/}
                            {/*        /!*</div>*!/*/}
                            {/*    </button>*/}
                            {/*</li>*/}

                            <h2 className="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
                                <svg className="w-4 h-5 flex-none hidden" viewBox="0 0 24 24" stroke="currentColor"
                                     strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                <span>{t('WEB SETTING')}</span>
                            </h2>

                            <li className="menu nav-item">
                                <button type="button"
                                        className={`${pathParts[pathParts.length - 1] === 'contents' ? 'active' : ''} nav-link group w-full`}
                                        onClick={() => toggleMenu('setting')}>
                                    <div className="flex items-center">
                                    <svg className="w-6 h-6" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.5" d="M20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10Z" fill="currentColor"></path><path d="M10 4.25C10.4142 4.25 10.75 4.58579 10.75 5V11C10.75 11.4142 10.4142 11.75 10 11.75C9.58579 11.75 9.25 11.4142 9.25 11V5C9.25 4.58579 9.58579 4.25 10 4.25Z" fill="currentColor"></path><path d="M10 15C10.5523 15 11 14.5523 11 14C11 13.4477 10.5523 13 10 13C9.44772 13 9 13.4477 9 14C9 14.5523 9.44772 15 10 15Z" fill="currentColor"></path></svg>
                                        <span
                                            className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark mt-1">Pengaturan</span>
                                        {/*<span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Admin Content')}</span>*/}
                                    </div>

                                    <div className={currentMenu === 'setting' ? 'rotate-90' : 'rtl:rotate-180'}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5"
                                                  strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'setting' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <NavLink to="/admin/profile">{t('Setting Profil')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/admin/contents">{t('Setting App')}</NavLink>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>

                            {/*<h2 className="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">*/}
                            {/*    <svg className="w-4 h-5 flex-none hidden" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">*/}
                            {/*        <line x1="5" y1="12" x2="19" y2="12"></line>*/}
                            {/*    </svg>*/}
                            {/*    <span>{t('supports')}</span>*/}
                            {/*</h2>*/}

                            {/*<li className="menu nav-item">*/}
                            {/*    <NavLink to="https://vristo.sbthemes.com" target="_blank" className="nav-link group">*/}
                            {/*        <div className="flex items-center">*/}
                            {/*            <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                            {/*                <path*/}
                            {/*                    fillRule="evenodd"*/}
                            {/*                    clipRule="evenodd"*/}
                            {/*                    d="M4 4.69434V18.6943C4 20.3512 5.34315 21.6943 7 21.6943H17C18.6569 21.6943 20 20.3512 20 18.6943V8.69434C20 7.03748 18.6569 5.69434 17 5.69434H5C4.44772 5.69434 4 5.24662 4 4.69434ZM7.25 11.6943C7.25 11.2801 7.58579 10.9443 8 10.9443H16C16.4142 10.9443 16.75 11.2801 16.75 11.6943C16.75 12.1085 16.4142 12.4443 16 12.4443H8C7.58579 12.4443 7.25 12.1085 7.25 11.6943ZM7.25 15.1943C7.25 14.7801 7.58579 14.4443 8 14.4443H13.5C13.9142 14.4443 14.25 14.7801 14.25 15.1943C14.25 15.6085 13.9142 15.9443 13.5 15.9443H8C7.58579 15.9443 7.25 15.6085 7.25 15.1943Z"*/}
                            {/*                    fill="currentColor"*/}
                            {/*                />*/}
                            {/*                <path*/}
                            {/*                    opacity="0.5"*/}
                            {/*                    d="M18 4.00038V5.86504C17.6872 5.75449 17.3506 5.69434 17 5.69434H5C4.44772 5.69434 4 5.24662 4 4.69434V4.62329C4 4.09027 4.39193 3.63837 4.91959 3.56299L15.7172 2.02048C16.922 1.84835 18 2.78328 18 4.00038Z"*/}
                            {/*                    fill="currentColor"*/}
                            {/*                />*/}
                            {/*            </svg>*/}
                            {/*            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('documentation')}</span>*/}
                            {/*        </div>*/}
                            {/*    </NavLink>*/}
                            {/*</li>*/}
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
